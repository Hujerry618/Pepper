$url = "mypanel://file:///C:/Windows/System32/notepad.exe"
Write-Host "Testing: $url"
Start-Process -FilePath $url -PassThru
Write-Host "Process started"
