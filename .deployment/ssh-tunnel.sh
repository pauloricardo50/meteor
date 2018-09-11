#!/bin/bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

# Installs dependencies
$SCRIPTPATH/../scripts/installTmuxinator.sh
$SCRIPTPATH/checkPackage.sh mongodb install

../scripts/box_out.sh "Establishing a SSH tunnel with args:" "$*"
babel-node -- ./ssh-tunnel/prepareSSHTunnel.js "$@" 
tmuxinator start ssh-tunnel -n ssh-tunnel -p ./ssh-tunnel/ssh-tunnel.yml
rm ./ssh-tunnel/ssh-tunnel.yml
