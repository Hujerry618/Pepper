' 直接测试 launcher.vbs 是否能正常工作
Dim shell
Set shell = CreateObject("WScript.Shell")

' 直接运行记事本
shell.Run "notepad.exe", 1, False

WScript.Quit 0
