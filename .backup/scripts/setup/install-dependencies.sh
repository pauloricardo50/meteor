#!/bin/bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

$SCRIPTPATH/install-tmux.sh
$SCRIPTPATH/install-s3cmd.sh