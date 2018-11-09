#!/bin/bash

set -e

npx babel-node -- scaleApplication.js "$@"
./scale.sh
rm scale.sh
