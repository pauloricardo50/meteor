#!/bin/bash

source ./colors.sh

if [ "$1" == "" ]; then
    echo "Microservice name was not provided"
    echo "Usage: setup-microservice.sh <microservice name>"
    exit 1
fi

MICROSERVICE=$1

echo -e "$TITLE_START PREPARING ${MICROSERVICE^^} MICROSERVICE $TITLE_END"
pwd

echo -e "$SECTION_START Creating symlinks $SECTION_END"

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
  echo -e "$SECTION_START Classifying Cities $SECTION_END"
  meteor npm run classify-cities

  echo -e "$SECTION_START Preparing front app plugin $SECTION_END"

  # Remove all symlinks in the parent directory except node_modules to
  # keep .bin symlinks
  (
    cd ../plugins/frontPlugin && \
    find . -type l -not -path "**/node_modules/**" -exec unlink {} \;
  )

  ( cd ../plugins/frontPlugin && npm rebuild node-sass );
  ( cd ../plugins/frontPlugin && npm i -q );
  ln -s ../../../core ../plugins/frontPlugin/src/core
  ( cd ../plugins/frontPlugin && meteor npm run build-production );

else
  echo -e "$SECTION_START Creating language files $SECTION_END"
  node -r esm ./createLanguages.js $MICROSERVICE
fi

ln -s ../../../core ../microservices/$MICROSERVICE/imports/core
./link.sh ../core/assets/public ../microservices/$MICROSERVICE/public
ln -s ../../core/assets/private ../microservices/$MICROSERVICE/private

echo -e "$SECTION_START Installing npm packages $SECTION_END"
( cd ../microservices/$MICROSERVICE && meteor npm i -q );
