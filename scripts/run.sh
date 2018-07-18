#!/bin/bash

# This script starts all microservices and points them to the same mongoDB instance

# Check if tmuxinator is installed
if ! type "tmuxinator" > /dev/null; then
  #if not tell user
  echo "You need to install tmuxinator"
fi


echo Running e-Potek... 
tmuxinator start run -p ./run.yml

