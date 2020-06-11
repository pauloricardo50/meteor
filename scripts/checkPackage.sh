#!/bin/bash

# Script to check if a package is installed
# Can install given package with "install" arg

# Supported OS
MAC="MAC"
LINUX="LINUX"

# Return OS name
getOS () {
    unameOut="$(uname -s)"
    case "${unameOut}" in
        Linux*)     echo $LINUX;;
        Darwin*)    echo $MAC;;
        *)          echo "UNKNOWN";;
    esac
}

# Install package on either Mac or Linux
installPackage () {
    local package=$1
    local machine=$(getOS)

    echo "Installing package $package for $machine..."

    # If MAC, install with brew
    # If LINUX, install with apt-get
    case "${machine}"  in 
        "${MAC}")
        # If brew is not installed, tell user and exit script
            if ! type "brew" > /dev/null; then
                echo "Please install homebrew"
                exit 1
            else
                brew install "${package}"
            fi
            ;;
        "${LINUX}")
            sudo apt-get install "${package}";;
        *)
        # If OS not supported, tell user and exit script
        echo "Unknown OS (supported: Mac or Linux)"
        exit 1
    esac
}

isPackageInstalled() {
    local package=$1
    local machine=$(getOS)

    case "${machine}"  in 
        "${MAC}")
            if ! brew list "${package}" >/dev/null 2>&1; then
                echo 0
            fi
            ;;
        "${LINUX}")
            if ! type "${package}" > /dev/null 2>&1; then
                echo 0
            fi
            ;;
        *)
        # If OS not supported, tell user and exit script
        echo "Unknown OS (supported: Mac or Linux)"
        exit 1
    esac
}

# Package to check
package=$1
isInstalled=$(isPackageInstalled $package)

# install arg given?
if [ -z "$2" ]; then
    install=false
elif [ "$2" = "install" ]; then
    install=true
else
    install=true
fi

# Check if package is installed
if [[ $isInstalled = 0 ]] ; then
    # If not installed and install arg given, install it
    if [ $install = true ]; then
        installPackage "${package}"
    else
    # If not installed, but install arg not given, return 0
        echo 0
    fi
fi 
