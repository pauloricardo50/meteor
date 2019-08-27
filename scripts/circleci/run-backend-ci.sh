#!/bin/bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

backendCommand=""
backendPort=5500

if [ $1 == '--test' ]
then
    backendCommand="start-test"
    backendPort=5505
else 
    backendCommand="start"
fi

if nc -z localhost $backendPort ; then
        echo "Backend already running !"
    else 
        echo "Running backend"
        cd $SCRIPTPATH/../../microservices/backend
        meteor npm run $backendCommand
fi