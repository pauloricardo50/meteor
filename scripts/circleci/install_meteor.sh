#!/bin/bash

# If the cached meteor directory exists, link its binary
# Else install meteor.
if [ -e ~/.meteor/meteor ]; then
  ~/app/scripts/circleci/symlink_cached_meteor_binary.sh
else
  echo "Meteor directory not found. Installing Meteor $METEOR_VERSION..."
  curl "https://install.meteor.com?release=$METEOR_VERSION" | /bin/sh
fi

cd ~
git checkout https://github.com/meteor/meteor.git --recursive
cd meteor
git checkout $METEOR_VERSION
./meteor --version

echo "alias meteor=~/meteor/meteor" >> ~/.bashrc
source ~/.bashrc

# FIXME: Do this temporarily while 1.7.1 can't be installed via curl
meteor update --release 1.7.1-beta.19
