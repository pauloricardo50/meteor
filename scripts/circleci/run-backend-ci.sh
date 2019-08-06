#!/bin/bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

backendCommand=""

if [ $1 == '--test' ]
then
    backendCommand="start-test"
else 
    backendCommand="start"
fi

if nc -z localhost 5500 ; then
        echo "Backend already running !"
    else 
        echo "Running backend"
        cd $SCRIPTPATH/../../microservices/backend
        meteor npm run $backendCommand
fi