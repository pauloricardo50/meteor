#!/bin/bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

if [ ! -d $SCRIPTPATH/../../microservices/backend/.meteor/local ]; then
    cd $SCRIPTPATH/../../microservices/backend && meteor npm run start & ./wait-port.sh killall node
fi

exit 0