#!/bin/bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

# Installs dependencies
$SCRIPTPATH/../scripts/installTmuxinator.sh
$SCRIPTPATH/../scripts/checkPackage.sh mongodb install

# Generate random ID for the application
RANDOM_ID=$(cat /dev/random | LC_CTYPE=C tr -dc "[:alpha:]" | head -c 8)

../scripts/box_out.sh "Establishing a SSH tunnel with args:" "$*"
npx babel-node -- ./ssh-tunnel/pullDbLocally.js "$@" -i $RANDOM_ID
tmuxinator start -p ./ssh-tunnel/ssh-tunnel-$RANDOM_ID.yml
rm ./ssh-tunnel/ssh-tunnel-$RANDOM_ID.yml

