#!/bin/bash
set -e
babel-node -- ./nginx/updateNginx.js 
./deploy-nginx.sh