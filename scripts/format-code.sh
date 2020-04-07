#!/bin/bash

echo "Formatting core files with eslint config..."
npx eslint --debug --fix --ext .jsx,.js ../core/

echo "Formatting microservices files with eslint config..."
# TODO: This script loops over core again for each microservice
npx eslint --debug --fix --ext .jsx,.js ../microservices/

echo "Formatting all CSS files"
npx csscomb ../core
npx csscomb ../microservices

echo "Sorting all imports"
npx import-sort --write "../core/**/*.js?(x)"
# TODO: This script loops over core again for each microservice
npx import-sort --write "../microservices/www/**/*.js?(x)"