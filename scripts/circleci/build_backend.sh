#!/bin/bash
SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"
BACKEND_PATH="$SCRIPT_PATH/../../microservices/backend"

# Expect lets you wait for command output before doing something else
# 1. Set the timeout to 30 mins, by default it's 10 seconds
# 2. cd to the right place, and "spawn" a command that expect will be watching
# 3. Wait for the meteor app to have launched with "expect 'some ouput'"
# 4. exit the expect command, killing the meteor process
expect -c "set timeout 1800; cd $BACKEND_PATH; spawn meteor npm run start; expect \"App running at:\"; exit"


exit 0