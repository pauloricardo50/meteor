#!/bin/bash
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

machine=$(getOS)

echo "Installing package sshpass for $machine..."
# If MAC, install with brew
# If LINUX, install with apt-get
case "${machine}"  in 
    "${MAC}")
        # If brew is not installed, tell user and exit script
        if ! type "brew" > /dev/null; then
            echo "Please install homebrew"
            exit 1
        else
            brew create https://sourceforge.net/projects/sshpass/files/sshpass/1.06/sshpass-1.06.tar.gz --force
            brew install sshpass
        fi
        ;;
    "${LINUX}")
        sudo apt-get update
        sudo apt-get install sshpass
        ;;
    *)
        # If OS not supported, tell user and exit script
        echo "Unknown OS (supported: Mac or Linux)"
        exit 1
esac