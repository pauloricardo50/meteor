#!/bin/bash
set -e
npx babel-node -- ./nginx/updateNginx.js
./deploy-nginx.sh
