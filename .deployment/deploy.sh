#!/bin/bash
START=`date +%s`
set -e

../scripts/box_out.sh "Deploying with args:" "$*"

./installDependencies.sh
meteor npm i

cd ..
meteor npm run setup

cd .deployment
echo "Preparing deployment..."
babel-node -- deploy.js "$@"
tmuxinator start deploy -p ./deploy.yml
rm ./deploy.yml

END=`date +%s`
runtime=$((END-START))

echo "e-Potek deployed! It took $runtime seconds"

