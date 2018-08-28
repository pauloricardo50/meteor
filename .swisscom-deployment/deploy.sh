#!/bin/bash

set -e

./predeploy.sh

cd ..
meteor npm run setup

cd .swisscom-deployment
echo "Preparing deployment..."
babel-node -- deploy.js "$@"
tmuxinator start deploy -p ./deploy.yml

