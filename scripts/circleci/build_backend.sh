#!/bin/bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

cd $SCRIPTPATH/../../microservices/backend

if [ ! -d ./.meteor/local ]; then

    meteor npm run start &

    until $(curl --output /dev/null --silent --head --fail http://localhost:5500);
        do 
            sleep 1 
        done

    killall node
fi

exit 0