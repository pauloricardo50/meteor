#!/bin/bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

backendCommand=""

if [ $1 == '--test' ]
then
    backendCommand="start-test"
else 
    backendCommand="start"
fi

if lsof -Pi :5500 -sTCP:LISTEN -t >/dev/null ; then
        echo "Backend already running !"
    else 
        echo "Running backend"
        cd $SCRIPTPATH/../../../microservices/backend
        meteor npm run $backendCommand
fi