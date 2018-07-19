#!/bin/bash

# This script starts all microservices and points them to the same mongoDB instance

# Run the pre-script
./prerun.sh

# Run tmuxinator script
echo Running e-Potek... 
tmuxinator start run -p ./run.yml

