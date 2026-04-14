' Personal Panel Protocol Handler (VBScript - Silent)
' Launches PowerShell completely hidden

Dim shell, psScript, url
Set shell = CreateObject("WScript.Shell")

If WScript.Arguments.Count = 0 Then
    WScript.Quit 1
End If

url = WScript.Arguments(0)
psScript = "C:\Users\Administrator\.openclaw\workspace\apps\personal-panel\launcher\launcher.ps1"

' Build command
Dim cmd
cmd = "powershell.exe -WindowStyle Hidden -ExecutionPolicy Bypass -File """ & psScript & """ """ & url & """"

' Run completely hidden (0 = hidden, False = don't wait)
shell.Run cmd, 0, False

Set shell = Nothing
