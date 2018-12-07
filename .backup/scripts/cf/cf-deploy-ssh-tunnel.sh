#!/bin/bash

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

# Change application name in manifest
# Appends the random id to the end
sed -i "s/  - name:.*/  - name: e-potek-backup-manager-$1/" $SCRIPTPATH/ssh-tunnel/manifest.yml


echo "Deploying app..."
cd $SCRIPTPATH/ssh-tunnel
cf target -s Production
cf push

