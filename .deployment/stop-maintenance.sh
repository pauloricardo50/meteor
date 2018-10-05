#!/bin/bash
set -e
babel-node -- ./nginx/maintenance.js stop
./deploy-nginx.sh