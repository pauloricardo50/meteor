#!/bin/bash
set -e

../scripts/box_out.sh "Starting maintenance with args:" "$*"

npx babel-node -- ./nginx/maintenance.js start "$@"
./deploy-nginx.sh
