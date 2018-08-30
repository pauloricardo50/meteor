#!/bin/bash

# Install tmuxinator if not installed
../scripts/installTmuxinator.sh

# Install cf-cli if not installed
cf=$(../scripts/checkPackage.sh cf-cli)

if [ "$cf" = '0' ]; then
    ./install-cf.sh
fi

