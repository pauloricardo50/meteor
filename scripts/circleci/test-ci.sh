#!/bin/bash

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
BACKEND_PORT="5500"
TEST_CMD="DDP_DEFAULT_CONNECTION_URL=http://localhost:5500 METEOR_PACKAGE_DIRS="packages:../../meteorPackages" SERVER_TEST_REPORTER=xunit SERVER_MOCHA_OUTPUT=~/app/results/unit-server.xml CLIENT_MOCHA_OUTPUT=~/app/results/unit-client.xml TEST_BROWSER_DRIVER=nightmare meteor test --once --driver-package meteortesting:mocha --settings settings-dev.json"

${SCRIPTPATH}/run-backend-ci.sh --test & ${SCRIPTPATH}/wait-port.sh $BACKEND_PORT $TEST_CMD
