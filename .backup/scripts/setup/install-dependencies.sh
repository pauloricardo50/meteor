#!/bin/bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

$SCRIPTPATH/install-cf.sh
$SCRIPTPATH/install-mongodb.sh
$SCRIPTPATH/install-tmux.sh
$SCRIPTPATH/install-s3cmd.sh