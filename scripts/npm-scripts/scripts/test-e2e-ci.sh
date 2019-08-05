#!/bin/bash

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
BACKEND_MONGO_PORT="5501"
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
elif [ $microservice == 'www' ] 
then
    let SERVER_PORT="3015"
fi

SERVER_E2E_CMD="DDP_DEFAULT_CONNECTION_URL=http://localhost:5500 METEOR_PACKAGE_DIRS=\"packages:../../meteorPackages\" meteor test --full-app --driver-package tmeasday:acceptance-test-driver --settings settings-dev.json --port ${SERVER_PORT}"
TEST_E2E_CMD="../../node_modules/cypress/bin/cypress run --reporter mocha-multi-reporters --reporter-options configFile=cypress/mocha-multi-reporters-config.json"

${SCRIPTPATH}/run-backend-ci.sh --test & ${SCRIPTPATH}/wait-port.sh $BACKEND_MONGO_PORT $SERVER_E2E_CMD &  ${SCRIPTPATH}/wait-port.sh $SERVER_PORT $TEST_E2E_CMD