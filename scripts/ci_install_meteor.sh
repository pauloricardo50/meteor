#!/bin/bash

# If the cached meteor directory exists, link its' binary
# Else install meteor.
if [ -e $HOME/.meteor/meteor ]; then
  echo "Meteor directory found. Symlinking binary..."
  # meteor_path is the 'meteor' command path (if any available)
  #  or a default binary path
  meteor_path=$(type -p meteor);

  if [ -z $meteor_path ];
  then
    meteor_path=/usr/local/bin/meteor;
  fi

  sudo ln -sf ~/.meteor/meteor $meteor_path;
  echo "Done."
else
  echo "Meteor directory not found. Installing Meteor $METEOR_VERSION..."
  curl https://install.meteor.com?release=$METEOR_VERSION | /bin/sh
fi