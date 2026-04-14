@echo off
setlocal enabledelayedexpansion

set "url=%~1"

REM Remove mypanel:// prefix
if "!url:~0,10!"=="mypanel://" set "url=!url:~10!"

REM Remove file:/// prefix
if "!url:~0,8!"=="file:///" set "url=!url:~8!"
if "!url:~0,8!"=="file:\\\" set "url=!url:~8!"

REM Use PowerShell to decode and execute (handles UTF-8 properly)
powershell -Command ^
    "$url='%url%'; ^
    $decoded = [System.Net.WebUtility]::UrlDecode($url); ^
    $decoded = $decoded -replace '/', '\\'; ^
    if ($decoded -match '^\\\\([A-Za-z]:\\.*)$') { $decoded = $matches[1] }; ^
    $decoded = $decoded -replace '^\\\\+', ''; ^
    Add-Content '$TEMP\mypanel-debug.txt' ('Time: ' + (Get-Date) + ' | Path: ' + $decoded); ^
    if (Test-Path $decoded -PathType Container) { ^
        Add-Content '$TEMP\mypanel-debug.txt' 'Type: Folder - Success'; ^
        Start-Process explorer.exe $decoded ^
    } elseif (Test-Path $decoded -PathType Leaf) { ^
        Add-Content '$TEMP\mypanel-debug.txt' 'Type: File - Success'; ^
        Start-Process $decoded ^
    } else { ^
        Add-Content '$TEMP\mypanel-debug.txt' 'Type: Not Found' ^
    }"
