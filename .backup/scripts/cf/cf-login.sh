#!/bin/bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

CF_USER="$(cat $SCRIPTPATH/.cf-credentials | sed -n "s/^user:\([^\s]*\)/\1/p")" 
CF_PASSWORD="$(cat $SCRIPTPATH/.cf-credentials | sed -n "s/^password:\([^\s]*\)/\1/p")" 

cf login -a https://api.lyra-836.appcloud.swisscom.com/ -u $CF_USER -p $CF_PASSWORD -s $1