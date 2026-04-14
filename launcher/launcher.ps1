# Personal Panel Protocol Handler (PowerShell - Hidden & Fast)
# UTF-8/Chinese path support with wildcard matching

param([string]$url)

# Log
$logPath = "$env:TEMP\mypanel-debug.txt"
"========================================" | Add-Content $logPath -Encoding UTF8
"Time: $(Get-Date)" | Add-Content $logPath -Encoding UTF8
"RAW: $url" | Add-Content $logPath -Encoding UTF8

# Remove mypanel:// prefix
$url = $url -replace '^mypanel://', ''

# Remove file:/// prefix (handle all formats)
if ($url -match '^file[:/\\]+(.+)$') {
    $url = $matches[1]
}

# Fix drive letter (D/ -> D:/)
if ($url -match '^([A-Za-z])/') {
    $url = "$($matches[1]):$($url.Substring(1))"
}

# URL Decode (UTF-8)
$url = [System.Net.WebUtility]::UrlDecode($url)

# Convert / to \
$url = $url -replace '/', '\'

# Remove leading backslashes
$url = $url -replace '^\\+', ''

"Decoded: $url" | Add-Content $logPath -Encoding UTF8

# Try direct path first
if (Test-Path -LiteralPath $url -PathType Leaf) {
    "Type: File - Success (direct)" | Add-Content $logPath -Encoding UTF8
    Invoke-Item -LiteralPath $url -ErrorAction SilentlyContinue
    exit
}

if (Test-Path -LiteralPath $url -PathType Container) {
    "Type: Folder - Success (direct)" | Add-Content $logPath -Encoding UTF8
    Start-Process "explorer.exe" "`"$url`""
    exit
}

# Wildcard matching for each segment
$drive = $url.Substring(0, 2)
$restPath = $url.Substring(2)
$segments = $restPath -split '\\' | Where-Object { $_ }

"Searching: $drive + $restPath" | Add-Content $logPath -Encoding UTF8

$currentPath = $drive
$found = $true
$lastWasFile = $false

foreach ($i in 0..($segments.Count - 1)) {
    $seg = $segments[$i]
    $isLast = ($i -eq $segments.Count - 1)
    $testPath = "$currentPath\$seg"
    
    if (Test-Path -LiteralPath $testPath) {
        $currentPath = $testPath
        if ($isLast -and (Test-Path -LiteralPath $testPath -PathType Leaf)) {
            $lastWasFile = $true
        }
    } else {
        # Wildcard match - search for matching name
        $parent = $currentPath
        if ($parent -match '^[A-Z]:$') {
            $parent = "$parent\"
        }
        
        # Try to find matching file/folder
        $match = $null
        if ($isLast) {
            # Last segment - could be file or folder
            $match = Get-ChildItem $parent -Filter "$seg*" -ErrorAction SilentlyContinue | 
                     Where-Object { $_.Name -like "$seg*" } | 
                     Select-Object -First 1
        } else {
            # Middle segment - must be folder
            $match = Get-ChildItem $parent -Directory -Filter "$seg*" -ErrorAction SilentlyContinue | 
                     Select-Object -First 1
        }
        
        if ($match) {
            $currentPath = $match.FullName
            "Matched: $($match.Name) -> $currentPath" | Add-Content $logPath -Encoding UTF8
            if ($isLast -and $match.PSIsContainer -eq $false) {
                $lastWasFile = $true
            }
        } else {
            $found = $false
            "Not found: $seg" | Add-Content $logPath -Encoding UTF8
            break
        }
    }
}

if ($found) {
    "Resolved: $currentPath" | Add-Content $logPath -Encoding UTF8
    if ($lastWasFile -or (Test-Path -LiteralPath $currentPath -PathType Leaf)) {
        "Type: File - Success" | Add-Content $logPath -Encoding UTF8
        Invoke-Item -LiteralPath $currentPath -ErrorAction SilentlyContinue
    } else {
        "Type: Folder - Success" | Add-Content $logPath -Encoding UTF8
        Start-Process "explorer.exe" "`"$currentPath`""
    }
} else {
    "Type: Not Found | Path: $url" | Add-Content $logPath -Encoding UTF8
}
