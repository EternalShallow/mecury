::设置编码方式
chcp 65001

::关闭乱七八糟的语言
@echo off

　　
::空格
echo.
set /p a= 请选择菜单(1、devServer;2、build;3、build:copy)：


if "%a%"=="1" (
  	start cmd /k "npm run dev"
  	exit
)else (
	if "%a%"=="2" (
	  	start cmd /k "npm run build"
	  	exit
  	)else (
	  	if "%a%"=="3" (
		  	start cmd /k "npm run build:copy"
		  	exit
	  	)
  	)
	echo 没有多余的选择，按任意键盘退出
  	pause
  	exit
)