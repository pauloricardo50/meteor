#!/bin/bash

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

echo "Deploying app..."
cd $SCRIPTPATH/ssh-tunnel
cf target -s Production
cf push