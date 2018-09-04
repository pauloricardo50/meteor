#!/bin/bash

# Install tmuxinator if not installed
../scripts/installTmuxinator.sh

# Install cf-cli if not installed
cf=$(../scripts/checkPackage.sh cf-cli)

if [ "$cf" = '0' ]; then
    ./install-cf.sh
fi

# Install blue-green-deploy
cf add-plugin-repo CF-Community https://plugins.cloudfoundry.org
cf install-plugin blue-green-deploy -r CF-Community -f
