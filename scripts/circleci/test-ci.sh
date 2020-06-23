#!/bin/bash

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
BACKEND_PORT="5505"
TEST_CMD="NODE_ICU_DATA=$PWD/node_modules/full-icu NIGHTMARE_WAIT_TIMEOUT=6000000 DDP_DEFAULT_CONNECTION_URL=http://localhost:$BACKEND_PORT METEOR_PACKAGE_DIRS="packages:../../meteorPackages" SERVER_TEST_REPORTER=xunit CLIENT_TEST_REPORTER=xunit SERVER_MOCHA_OUTPUT=~/app/results/unit-server.xml CLIENT_MOCHA_OUTPUT=~/app/results/unit-client.xml TEST_BROWSER_DRIVER=nightmare meteor test --once --driver-package meteortesting:mocha --settings settings-dev.json --exclude-archs web.browser.legacy"

microservice="${PWD##*/}"

if [ "$microservice" != "backend" ]; then
  ${SCRIPTPATH}/run-backend-ci.sh --test &
fi;
eval ${TEST_CMD}
