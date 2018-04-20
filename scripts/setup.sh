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

    if [[ $i == 'www' ]];
    then
      #only need variables.scss in www
      mkdir ../microservices/$i/client/css
      ln -s ../../../../core/assets/css/variables.scss ../microservices/$i/client/css/variables.scss

      mkdir ../microservices/$i/client/css/external-styles      
      ln -s ../../../../../core/assets/css/external-styles/bootstrap-popover.css ../microservices/$i/client/css/external-styles/bootstrap-popover.css
      ln -s ../../../../../core/assets/css/external-styles/rc-slider.css ../microservices/$i/client/css/external-styles/rc-slider.css
    else
      ln -s ../../../core/assets/css ../microservices/$i/client/css
    fi

    # ln -s ../../core/.babelrc ../microservices/$i/.babelrc

    # public and private folders can't have any symlink: https://github.com/meteor/meteor/issues/7013
    echo "Copying public/private folders from core"
    rsync -a --delete-before ../core/assets/public/ ../microservices/$i/public/

    rsync -a --delete-before ../core/assets/private/ ../microservices/$i/private/


    if [[ $DO_CLEAN == true ]];
    then
      echo "Cleaning and installing npm packages"
      ( cd ../microservices/$i && rm -f ./package-lock.json && rm -rf node_modules/ && npm cache clear --force && meteor npm install );

      echo "Resetting meteor"
      ( cd ../microservices/$i && meteor reset )
    else
      echo "Installing npm packages"
      ( cd ../microservices/$i && meteor npm install );
    fi


  done


echo "Installing npm packages in core/"
( cd ../core && meteor npm install );

echo "Installing npm packages in root"
( cd .. && meteor npm install );

echo "Creating language files..."
babel-node ./createLanguages.js

end=`date +%s`
runtime=$((end-start))

echo "e-Potek is ready! It took $runtime seconds"
