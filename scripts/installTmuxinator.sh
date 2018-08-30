#!/bin/bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

# Check if tmux, ruby and tmuxinator are installed
$SCRIPTPATH/checkPackage.sh tmux install
$SCRIPTPATH/checkPackage.sh ruby install

if ! gem list -i tmuxinator >/dev/null; then
    echo "Installing tmuxinator"
    gem install tmuxinator
fi

