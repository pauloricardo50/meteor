#!/bin/bash

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
BACKEND_PORT="5505"
TEST_CMD="DDP_DEFAULT_CONNECTION_URL=http://localhost:$BACKEND_PORT METEOR_PACKAGE_DIRS="packages:../../meteorPackages" SERVER_TEST_REPORTER=xunit CLIENT_TEST_REPORTER=xunit SERVER_MOCHA_OUTPUT=~/app/results/unit-server.xml CLIENT_MOCHA_OUTPUT=~/app/results/unit-client.xml TEST_BROWSER_DRIVER=nightmare meteor test --once --driver-package meteortesting:mocha --settings settings-dev.json"

${SCRIPTPATH}/run-backend-ci.sh --test & ${SCRIPTPATH}/wait-port.sh $BACKEND_PORT $TEST_CMD
