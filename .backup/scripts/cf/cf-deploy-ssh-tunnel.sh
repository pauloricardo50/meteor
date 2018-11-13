#!/bin/bash

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

sed -i "s/  - name:.*/  - name: e-potek-backup-manager-$1/" $SCRIPTPATH/ssh-tunnel/manifest.yml


echo "Deploying app..."
cd $SCRIPTPATH/ssh-tunnel
cf target -s Production
cf push

