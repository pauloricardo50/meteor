#!/bin/bash

# This scripts does a bunch of repetitive setup for each microservice
# such as installing things, symlinks, copying necessary folders

start=`date +%s`
echo "Preparing e-Potek..."
doClean=false

# check for flag arguments
while getopts ":c" opt; do
  case $opt in
  c)
    doClean=true
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
for i in 'sAdmin' 'sApp' 'sLender' 'sWww'
  do
    echo "Preparing $i..."

    echo "Creating symlinks"
    ln -s ../../core ../$i/imports/core
    ln -s ../../core/assets/css ../$i/client/css
    ln -s ../core/.babelrc ../$i/.babelrc

    # public and private folders can't have any symlink: https://github.com/meteor/meteor/issues/7013
    echo "Creating public/private folders"
    rm -rf ../$i/public
    cp -a ../core/assets/public ../$i/public

    rm -rf ../$i/private
    cp -a ../core/assets/private ../$i/private


    if [[ $doClean == true ]];
    then
      echo "Cleaning and installing npm packages"
      ( cd ../$i && rm -f ./package-lock.json && rm -rf node_modules/ && npm cache clear --force && meteor npm install );
    else
      echo "Installing npm packages"
      ( cd ../$i && meteor npm install );
    fi

    echo "Resetting meteor"
    ( cd ../$i && meteor reset )
  done

echo "Installing npm packages in core/"
( cd ../core && npm install );

echo "Creating language files..."
node ./createLanguages.js

end=`date +%s`
runtime=$((end-start))

echo "e-Potek is ready! It took $runtime seconds"
