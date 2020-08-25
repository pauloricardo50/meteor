#!/bin/bash

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
BACKEND_PORT="5505"
SERVER_PORT=""

microservice="$1"

if [ $microservice == 'app' ]
then
    let SERVER_PORT="4015"
elif [ $microservice == 'admin' ]
then
    let SERVER_PORT="5015"
elif [ $microservice == 'pro' ]
then
    let SERVER_PORT="4115"
fi

# If two Meteor apps try to build a local package at the same time,
# One of them will fail when copying node_modules
# meteor list builds local packages, so only the other app still
# has to build them
METEOR_PACKAGE_DIRS="packages:../../meteorPackages" meteor list

${SCRIPTPATH}/run-backend-ci.sh --test &

DDP_DEFAULT_CONNECTION_URL=http://localhost:$BACKEND_PORT \
    METEOR_PACKAGE_DIRS="packages:../../meteorPackages" \
    meteor test --full-app --driver-package tmeasday:acceptance-test-driver --settings settings-dev.json --port ${SERVER_PORT} &

TEST_E2E_CMD="../../node_modules/cypress/bin/cypress run --reporter mocha-multi-reporters --reporter-options configFile=cypress/mocha-multi-reporters-config.json"
${SCRIPTPATH}/wait-port.sh $BACKEND_PORT "echo \"backend running\"" && ${SCRIPTPATH}/wait-port.sh $SERVER_PORT $TEST_E2E_CMD
