#!/bin/bash

start=`date +%s`
echo "Preparing e-Potek..."

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


    echo "Installing clean node_modules"
    if [[ doClean ]];
    then
      ( cd ../$i && rm ./package-lock.json && rm -rf node_modules/ && npm cache clear --force && meteor npm install );
    else
      ( cd ../$i && rm -rf node_modules/ && meteor npm install );
    fi
  done

end=`date +%s`
runtime=$((end-start))

echo "e-Potek is ready! It took $runtime seconds"
