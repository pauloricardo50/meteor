#!/bin/bash

# This scripts does a bunch of repetitive setup for each microservice
# such as installing things, symlinks, copying necessary folders

start=`date +%s`
echo "Preparing e-Potek..."
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

# Remove all symlinks in the parent directory
find .. -type l -exec unlink {} \;

# Prepare every microservice
for i in 'admin' 'app' 'lender' 'www'
  do
    echo "Preparing $i microservice..."

    echo "Creating symlinks"
    ln -s ../../../core ../microservices/$i/imports/core

    # public and private folders can't have any symlink: https://github.com/meteor/meteor/issues/7013
    # So copy them over with rsync
    echo "Copying public/private folders from core"
    rsync -a --delete-before ../core/assets/public/ ../microservices/$i/public/
    rsync -a --delete-before ../core/assets/private/ ../microservices/$i/private/

    if [[ $DO_CLEAN == true ]];
    then
      echo "Cleaning npm packages"
      ( cd ../microservices/$i && rm -f ./package-lock.json && rm -rf node_modules/ && npm cache clear --force);

      echo "Resetting meteor"
      ( cd ../microservices/$i && meteor reset );
    fi

    echo "Installing npm packages"
    ( cd ../microservices/$i && meteor npm install );
  done

if [[ $DO_CLEAN == true ]];
then
  echo "Cleaning and installing root npm packages"
  ( cd ../ && rm -f ./package-lock.json && rm -rf node_modules/ && npm cache clear --force);

  echo "Cleaning and installing core npm packages"
  ( cd ../core && rm -f ./package-lock.json && rm -rf node_modules/ && npm cache clear --force);
fi

echo "Installing npm packages in root"
( cd .. && meteor npm install );

echo "Installing npm packages in core/"
( cd ../core && meteor npm install );

echo "Installing global packages"
meteor npm i -g babel-cli start-server-and-test

echo "Creating language files..."
meteor babel-node ./createLanguages.js

end=`date +%s`
runtime=$((end-start))

echo "e-Potek is ready! It took $runtime seconds"
