#!/bin/bash
echo "Running smoke tests..." 

npm install --save nightmare
npm install --save cfenv
npx babel-node -- test.js
