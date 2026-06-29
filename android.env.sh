#!/bin/bash
# Android build environment setup script

# Export Android SDK location
export ANDROID_SDK_ROOT=$ANDROID_HOME
export ANDROID_HOME=${ANDROID_HOME:="/root/.android"}

# Add Android tools to PATH
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
export PATH=$PATH:$ANDROID_SDK_ROOT/tools
export PATH=$PATH:$ANDROID_SDK_ROOT/tools/bin

# Java setup
export JAVA_HOME=$JAVA_HOME_17_X64

echo "Android build environment configured"
echo "ANDROID_HOME: $ANDROID_HOME"
echo "JAVA_HOME: $JAVA_HOME"
