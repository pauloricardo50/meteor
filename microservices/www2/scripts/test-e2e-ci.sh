#!/bin/bash

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
SCRIPTS_DIR="../../../scripts/circleci"
BACKEND_PORT="5505"
GATSBY_E2E_PORT="3015"

export GATSBY_E2E_TEST="true"

GATSBY_E2E_CMD="npm run develop -- -p $GATSBY_E2E_PORT"
TEST_E2E_CMD="../../node_modules/cypress/bin/cypress run --reporter mocha-multi-reporters --reporter-options configFile=cypress/mocha-multi-reporters-config.json"


${SCRIPTPATH}/$SCRIPTS_DIR/run-backend-ci.sh --test & \
  ${SCRIPTPATH}/$SCRIPTS_DIR/wait-port.sh "$BACKEND_PORT" "$GATSBY_E2E_CMD" & \
  ${SCRIPTPATH}/$SCRIPTS_DIR/wait-port.sh "$SERVER_PORT" "$TEST_E2E_CMD"
