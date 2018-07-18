#!/bin/bash

# Check if tmux, ruby and tmuxinator are installed
./checkPackage.sh tmux install
./checkPackage.sh ruby install
tmuxinatorInstalled=$(./checkPackage.sh tmuxinator)
if [[ $tmuxinatorInstalled = 0 ]]; then
  echo "Installing tmuxinator"
  gem install tmuxinator
fi
