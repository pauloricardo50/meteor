#!/bin/bash

if [ "$1" == "" ]; then
    echo "Microservice name was not provided"
    echo "Usage: setup-microservice.sh <microservice name>"
    exit 1
fi

MICROSERVICE=$1

echo "Preparing $MICROSERVICE microservice"
pwd

echo "Creating symlinks"

# Remove all symlinks in the parent directory except node_modules to
# keep .bin symlinks
(
  cd ../microservices/$MICROSERVICE && \
  find . -type l -not -path "**/node_modules/**" -exec unlink {} \;
)

if [[ $MICROSERVICE == "www2" ]];
then
  ( cd ../microservices/www2 && npm install -q );
  ln -s ../../../core ../microservices/www2/src/core
  exit 0
fi;

if [[ $MICROSERVICE == "backend" ]];
then
  echo "Classifying Cities"
  meteor npm run classify-cities

  echo "Preparing front app plugin"
  ( cd ../plugins/frontPlugin && npm rebuild node-sass );
  ( cd ../plugins/frontPlugin && npm i -q );
  ln -s ../../../core ../plugins/frontPlugin/src/core
  ( cd ../plugins/frontPlugin && meteor npm run build-production );

else
  echo "Creating language files"
  meteor npx babel-node ./createLanguages.js $MICROSERVICE
fi

ln -s ../../../core ../microservices/$MICROSERVICE/imports/core
./link.sh ../core/assets/public ../microservices/$MICROSERVICE/public
ln -s ../../core/assets/private ../microservices/$MICROSERVICE/private

echo "Installing npm packages"
( cd ../microservices/$MICROSERVICE && meteor npm i -q );
