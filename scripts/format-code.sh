#!/bin/bash

echo "Formatting all files with eslint config..."
npx eslint --fix --ext .jsx,.js ../core
npx eslint --fix --ext .jsx,.js ../microservices

echo "Formatting all CSS files"
npx csscomb ../core
npx csscomb ../microservices

echo "Sorting all imports"
npx import-sort --write "../core/**/*.js?(x)"
npx import-sort-cli "../microservices/**/*.js?(x)"