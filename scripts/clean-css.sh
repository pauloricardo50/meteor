#!/bin/bash

# Check if ttab is installed
if ! type "csscomb" > /dev/null; then
  # install ttab if not
  echo Installing csscomb
  meteor npm i -g csscomb
fi

csscomb ../core
csscomb ../microservices
