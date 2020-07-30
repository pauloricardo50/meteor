#!/bin/bash

echo "Formatting core files with eslint config..."
# npx eslint --debug --fix --ext .jsx,.js --ignore-pattern "../core/assets/**" "../core/**"

echo "Formatting microservices files with eslint config..."
# npx eslint --debug --fix --ext ".jsx,.js"
# npx eslint --debug --fix --ext .jsx,.js --ignore-pattern "../microservices/**/core/**" "../microservices/**/imports/**"

echo "Formatting all CSS files"
npx csscomb ../core
npx csscomb ../microservices

echo "Sorting all imports"
npx import-sort --write "../core/**/*.js?(x)"
npx import-sort --write "../microservices/**/imports/**/*.js?(x)" "!../microservices/**/core/**/*.js?(x)" "!../**/node_modules/**"
