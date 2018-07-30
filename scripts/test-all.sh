#!/bin/bash

# This script starts all microservices and points them to the same mongoDB instance

# Run the pre-script
./prerun.sh

# Run tmuxinator script
echo Testing all of e-Potek
tmuxinator start test-all -p ./test-all.yml

