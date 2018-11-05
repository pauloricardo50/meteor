#!/bin/bash
set -e
npx babel-node -- ./nginx/maintenance.js stop
./deploy-nginx.sh
