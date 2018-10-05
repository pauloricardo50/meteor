#!/bin/bash

# This is a small script to be ran directly.
# Just change the build nb you want the artifacts from
BUILD_NB=3684

CIRCLE_TOKEN=5872f5dab39561e8b4fdcd261c8e7abda740f574

curl https://circleci.com/api/v1.1/project/github/e-Potek/epotek/$BUILD_NB/artifacts?circle-token=$CIRCLE_TOKEN | grep -o 'https://[^"]*' > artifacts.txt

< ./artifacts.txt xargs -I % wget %?circle-token=$CIRCLE_TOKEN