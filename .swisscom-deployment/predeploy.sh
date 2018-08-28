#!/bin/bash

# Check if tmux, ruby and tmuxinator are installed
../scripts/checkPackage.sh tmux install
../scripts/checkPackage.sh ruby install

if ! gem list -i tmuxinator >/dev/null; then
    echo "Installing tmuxinator"
    gem install tmuxinator
fi

cf=$(../scripts/checkPackage.sh cf-cli)

if [ "$cf" = '0' ]; then
    ./install-cf.sh
fi

