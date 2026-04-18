#!/bin/sh

WRAPPER_DIR="$(cd "$(dirname "$0")" && pwd)/.mvn/wrapper"
WRAPPER_JAR="$WRAPPER_DIR/maven-wrapper.jar"
WRAPPER_PROPS="$WRAPPER_DIR/maven-wrapper.properties"

if [ ! -f "$WRAPPER_JAR" ]; then
  echo "Maven wrapper JAR not found. Downloading..."
  WRAPPER_URL=$(grep '^wrapperUrl=' "$WRAPPER_PROPS" | cut -d'=' -f2-)
  curl -fsSL "$WRAPPER_URL" -o "$WRAPPER_JAR"
fi

if [ ! -f "$WRAPPER_JAR" ]; then
  echo "Failed to download Maven wrapper JAR."
  exit 1
fi

exec java -Dmaven.multiModuleProjectDirectory="$(cd "$(dirname "$0")" && pwd)" -classpath "$WRAPPER_JAR" org.apache.maven.wrapper.MavenWrapperMain "$@"
