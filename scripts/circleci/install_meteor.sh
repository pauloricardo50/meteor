#!/bin/bash

# If the cached meteor directory exists, link its binary
# Else install meteor.
if [ -e ~/.meteor/meteor ]; then
  ~/app/scripts/circleci/symlink_cached_meteor_binary.sh
else
  echo "Meteor directory not found. Installing Meteor $METEOR_VERSION..."
  curl "https://install.meteor.com?release=$METEOR_VERSION" | /bin/sh
fi