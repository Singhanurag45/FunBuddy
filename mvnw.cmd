@ECHO OFF
SETLOCAL

set WRAPPER_DIR=%~dp0.mvn\wrapper
set WRAPPER_JAR=%WRAPPER_DIR%\maven-wrapper.jar
set WRAPPER_PROPS=%WRAPPER_DIR%\maven-wrapper.properties

if not exist "%WRAPPER_JAR%" (
  echo Maven wrapper JAR not found. Downloading...
  powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$props = Get-Content '%WRAPPER_PROPS%' | Where-Object { $_ -match '^wrapperUrl=' }; " ^
    "$url = ($props -split '=',2)[1]; " ^
    "Invoke-WebRequest -Uri $url -OutFile '%WRAPPER_JAR%'"
)

if not exist "%WRAPPER_JAR%" (
  echo Failed to download Maven wrapper JAR.
  exit /b 1
)

java -Dmaven.multiModuleProjectDirectory="%CD%" -classpath "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
ENDLOCAL
