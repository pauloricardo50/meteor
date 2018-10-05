#!/bin/bash

cd ./nginx/nginx
cf target -s Nginx
cf blue-green-deploy e-potek-nginx -f manifest.yml --delete-old-apps  
rm manifest.yml
