#!/bin/bash
echo "Running smoke tests..." 

npm install --save nightmare
npm install --save cfenv

npx babel-node -- test.js

if [ $? -eq 0 ]; then
    echo "Smoke tests success"
else
    exit 1
fi
