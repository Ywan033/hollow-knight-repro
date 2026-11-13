@echo off
rem 启动本地服务并用默认浏览器打开游戏（game\index.html）。
node "%~dp0serve.mjs" %* --open
