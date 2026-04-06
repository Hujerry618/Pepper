' Personal Panel Protocol Handler
' Fixed: Chinese path support

On Error Resume Next

Function URLDecode(str)
    Dim i, ch, hex, decoded
    decoded = ""
    i = 1
    Do While i <= Len(str)
        ch = Mid(str, i, 1)
        If ch = "%" Then
            If i + 2 <= Len(str) Then
                hex = Mid(str, i + 1, 2)
                If IsHex(hex) Then
                    decoded = decoded & Chr(CLng("&H" & hex))
                    i = i + 3
                Else
                    decoded = decoded & ch
                    i = i + 1
                End If
            Else
                decoded = decoded & ch
                i = i + 1
            End If
        ElseIf ch = "+" Then
            decoded = decoded & " "
            i = i + 1
        Else
            decoded = decoded & ch
            i = i + 1
        End If
    Loop
    URLDecode = decoded
End Function

Function IsHex(str)
    Dim i, ch
    IsHex = True
    For i = 1 To Len(str)
        ch = Mid(str, i, 1)
        If Not ((ch >= "0" And ch <= "9") Or (ch >= "A" And ch <= "F") Or (ch >= "a" And ch <= "f")) Then
            IsHex = False
            Exit Function
        End If
    Next
End Function

Dim args, url, fso, logFile, logPath, shell
Set args = WScript.Arguments

If args.Count = 0 Then
    MsgBox "No parameter", 16, "mypanel"
    WScript.Quit 1
End If

url = args(0)

If Left(url, 10) = "mypanel://" Then
    url = Mid(url, 11)
End If

url = URLDecode(url)
url = Replace(url, "%20", " ")

' Remove file prefix and all leading slashes
' Handles: file:///, file://, file///, file:/, file:  etc.
If LCase(Left(url, 4)) = "file" Then
    url = Mid(url, 5)  ' Remove "file"
    ' Remove ALL leading slashes/colons
    Do While Left(url, 1) = "/" Or Left(url, 1) = ":"
        url = Mid(url, 2)
    Loop
    ' Convert remaining forward slashes to backslashes
    url = Replace(url, "/", "\")
End If

' Remove leading backslashes
Do While Left(url, 1) = "\"
    url = Mid(url, 2)
Loop

Set shell = CreateObject("WScript.Shell")

If fso.FolderExists(url) Then
    shell.Run "explorer.exe """ & url & """", 1, False
ElseIf fso.FileExists(url) Then
    shell.Run """" & url & """", 1, False
Else
    MsgBox "Not found: " & vbCrLf & url, 16, "mypanel"
    WScript.Quit 2
End If

Set shell = Nothing
Set fso = Nothing
WScript.Quit 0
