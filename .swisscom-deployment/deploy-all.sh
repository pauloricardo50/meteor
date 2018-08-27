#!/bin/bash

cd ..
meteor npm run setup

cd .swisscom-deployment
tmuxinator start deploy -p ./deploy-all.yml

