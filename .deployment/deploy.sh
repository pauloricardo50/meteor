#!/bin/bash
START=`date +%s`
set -e

../scripts/box_out.sh "Deploying with args:" "$*"

./installDependencies.sh

cf oauth-token
if [ "$?" -ne 0 ]; then
    exit 1;
fi

meteor npm i

cd ..
meteor npm run setup

cd .deployment
echo "Preparing deployment..."
npx babel-node -- deploy.js "$@"
tmuxinator start deploy -p ./deploy.yml
rm ./deploy.yml

END=`date +%s`
runtime=$((END-START))

../scripts/box_out.sh  "e-Potek deployed! It took $runtime seconds"

