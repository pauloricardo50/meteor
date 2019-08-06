#!/bin/bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"


if [ ! -d ./.meteor/local ]; then

    cd $SCRIPTPATH/../../microservices/backend && meteor npm run start &

    until $(curl --output /dev/null --silent --head --fail http://localhost:5500);
        do 
            sleep 1 
        done

    killall node
fi

exit 0