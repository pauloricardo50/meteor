#!/bin/bash

set -e

./installDependencies.sh
meteor npm i

cd ..
meteor npm run setup

cd .deployment
echo "Preparing deployment..."
babel-node -- deploy.js "$@"
tmuxinator start deploy -p ./deploy.yml
rm ./deploy.yml


