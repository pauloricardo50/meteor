#!/bin/bash

# Check if csscomb is installed
if ! type "csscomb" > /dev/null; then
  # install csscomb if not
  echo Installing csscomb
  meteor npm i -g csscomb
fi

csscomb ../core
csscomb ../microservices
