#!/bin/bash

echo "Formatting all files with eslint config..."
npx eslint --fix --ext .jsx,.js ..

echo "Formatting all CSS files"
# Check if csscomb is installed
if ! type "csscomb" > /dev/null; then
  # install csscomb if not
  echo Installing csscomb
  meteor npm i -g csscomb
fi

csscomb ../core
csscomb ../microservices

echo "Sorting all imports"
npx import-sort --write "../core/**/*.js?(x)"
npx import-sort-cli "../microservices/**/*.js?(x)"