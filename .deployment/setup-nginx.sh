#!/bin/bash

cd ./nginx
cf target -s Nginx
cf blue-green-deploy e-potek-nginx -f manifest.yml --delete-old-apps  