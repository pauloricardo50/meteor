#!/bin/bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

cd $SCRIPTPATH/../../microservices/backend && meteor npm run start & ./$SCRIPTPATH/wait-port.sh killall node

exit 0