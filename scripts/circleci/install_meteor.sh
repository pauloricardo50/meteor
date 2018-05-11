#!/bin/bash

# If the cached meteor directory exists, link its binary
# Else install meteor.
if [ -e $HOME/.meteor/meteor ]; then
  echo "Meteor directory found. Symlinking binary..."

  # `meteor_path`` is the 'meteor' command's path (if any available)
  meteor_path=$(type -p meteor);

  # If the `meteor_path` is empty (meaning 'meteor' command doesn't exist)
  # a default binary path is set for it
  if [ -z $meteor_path ];
  then
    meteor_path=/usr/local/bin/meteor;
  fi

  sudo ln -sf ~/.meteor/meteor $meteor_path;
  echo "Done."
else
  METEOR_VERSION=1.6.1.1
  echo "Meteor directory not found. Installing Meteor $METEOR_VERSION..."
  curl https://install.meteor.com?release=$METEOR_VERSION | /bin/sh
fi