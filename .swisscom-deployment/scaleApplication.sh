#!/bin/bash

set -e

babel-node -- scaleApplication.js "$@"
./scale.sh
rm scale.sh