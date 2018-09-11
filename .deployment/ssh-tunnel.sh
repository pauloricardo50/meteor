#!/bin/bash
../scripts/box_out.sh "Establishing a SSH tunnel with args:" "$*"
babel-node -- ./ssh-tunnel/createSSHTunnel.js "$@" 
