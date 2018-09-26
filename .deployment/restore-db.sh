#!/bin/bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

# Installs dependencies
$SCRIPTPATH/../scripts/installTmuxinator.sh
$SCRIPTPATH/../scripts/checkPackage.sh mongodb install

../scripts/box_out.sh "Establishing a SSH tunnel with args:" "$*"
babel-node -- ./ssh-tunnel/restoreDB.js "$@" 
tmuxinator start -p ./ssh-tunnel/ssh-tunnel.yml
rm ./ssh-tunnel/ssh-tunnel.yml
 