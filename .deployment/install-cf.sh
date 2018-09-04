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

echo "Installing package cf for $machine..."
# If MAC, install with brew
# If LINUX, install with apt-get
case "${machine}"  in 
    "${MAC}")
        # If brew is not installed, tell user and exit script
        if ! type "brew" > /dev/null; then
            echo "Please install homebrew"
            exit 1
        else
            brew tap cloudfoundry/tap
            brew install cf-cli
        fi
        ;;
    "${LINUX}")
        wget -q -O - https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key | sudo apt-key add -
        echo "deb https://packages.cloudfoundry.org/debian stable main" | sudo tee /etc/apt/sources.list.d/cloudfoundry-cli.list
        sudo apt-get update
        sudo apt-get install cf-cli
        ;;
    *)
        # If OS not supported, tell user and exit script
        echo "Unknown OS (supported: Mac or Linux)"
        exit 1
esac