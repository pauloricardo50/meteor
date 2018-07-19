#!/bin/bash

# Check if tmux, ruby and tmuxinator are installed
./checkPackage.sh tmux install
./checkPackage.sh ruby install

if ! gem list -i tmuxinator >/dev/null; then
    echo "Installing tmuxinator"
    gem install tmuxinator
fi

