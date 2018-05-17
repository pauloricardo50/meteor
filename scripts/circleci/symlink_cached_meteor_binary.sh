#!/bin/bash

# If the cached meteor directory exists, link its binary.
if [ -e ~/.meteor/meteor ]; then
  echo "Meteor directory found. Symlinking binary..."

  # `METEOR_PATH` is the 'meteor' command's path (if any available)
  METEOR_PATH="$(type -p meteor)";

  # If the `METEOR_PATH` is empty (meaning 'meteor' command doesn't exist)
  # a default binary path is set for it
  if [ -z "$METEOR_PATH" ];
  then
    METEOR_PATH=/usr/local/bin/meteor;
  fi

  sudo ln -sf ~/.meteor/meteor "$METEOR_PATH";
  echo "Done symlinking meteor binary."
else
  echo "Meteor directory not found.";
fi