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

# Prepare every microservice
for i in 'admin' 'app' 'pro' 'www' 'backend'
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
  done

if [[ $DO_CLEAN == true ]];
then
  echo "Cleaning and installing root npm packages"
  ( cd ../ && rm -f ./package-lock.json && rm -rf node_modules/ && npm cache clear -fq );
fi

echo "Installing npm packages in root"
( cd .. && meteor npm i -q );

echo "Installing npm packages in .deployment"
( cd ../.deployment && meteor npm i -q );

echo "Creating language files"
meteor npx babel-node ./createLanguages.js

echo "Preparing front app plugin"
( cd ../plugins/frontPlugin && npm rebuild node-sass );
( cd ../plugins/frontPlugin && npm i -q );
ln -s ../../../core ../plugins/frontPlugin/src/core
( cd ../plugins/frontPlugin && meteor npm run build-production );


echo "Preparing gatsby brand website"
( cd ../microservices/www2 && npm i -q );
ln -s ../../../core ../microservices/www2/src/core

echo "Setting up sort-import style"
ln -s ../plugins/import-sort-style-epotek ../node_modules/.

end=`date +%s`
runtime=$((end-start))

echo "e-Potek is ready! It took $runtime seconds"
