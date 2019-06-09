#!/bin/bash

# This scripts does a bunch of repetitive setup for each microservice
# such as installing things, symlinks, copying necessary folders

start=`date +%s`
echo "Preparing e-Potek :]"
DO_CLEAN=false

# check for flag arguments
while getopts ":c" opt; do
  case $opt in
  c)
    DO_CLEAN=true
    echo "-c flag set: Also hard cleaning up all node_modules" >&2
    ;;
  \?)
    echo "Invalid option: -$OPTARG, exiting... (please try again though)" >&2
    exit
    ;;
 esac
done

# Remove all symlinks in the parent directory except node_modules to
# keep .bin symlinks
find .. -type l -not -path "**/node_modules/**" -exec unlink {} \;

# Install flow-typed globally to install all used packages' types
if [[ $DO_CLEAN == true ]];
then
  echo "Installing flow and flow-typed"
  # meteor npm i -gq flow-typed
  # npm i -g flow-bin

  echo "Remove current flow typed libdefs"
  ( cd .. && rm -rf flow-typed );
fi

# Prepare every microservice
for i in 'admin' 'app' 'pro' 'www'
  do
    echo "Preparing $i microservice"

    echo "Creating symlinks"
    pwd
    ln -s ../../../core ../microservices/$i/imports/core
    ./link.sh ../core/assets/public ../microservices/$i/public
    ln -s ../../core/assets/private ../microservices/$i/private



    if [[ $DO_CLEAN == true ]];
    then
      echo "Cleaning npm packages"
      ( cd ../microservices/$i && rm -f ./package-lock.json && rm -rf node_modules/ && npm cache clear -fq );

      echo "Resetting meteor"
      ( cd ../microservices/$i && meteor reset );
    fi

    echo "Installing npm packages"
    ( cd ../microservices/$i && meteor npm i -q );

    # Do this after installing npm packages
    if [[ $DO_CLEAN == true ]];
    then
      # Use --skip to ignore missing libdefs
      echo "Fetching types for installed node_modules"
      ( cd ../microservices/$i && meteor npx flow-typed install --skip -p ../.. );
    fi
  done

if [[ $DO_CLEAN == true ]];
then
  echo "Cleaning and installing root npm packages"
  ( cd ../ && rm -f ./package-lock.json && rm -rf node_modules/ && npm cache clear -fq );

  echo "Cleaning up all CSS"
  ./clean-css.sh
fi

echo "Installing npm packages in root"
( cd .. && meteor npm i -q );

echo "Installing npm packages in .deployment"
( cd ../.deployment && meteor npm i -q );

echo "Creating language files"
meteor npx babel-node ./createLanguages.js

end=`date +%s`
runtime=$((end-start))

echo "e-Potek is ready! It took $runtime seconds"
