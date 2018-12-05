#!/bin/bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

cf ssh -L $1:kubernetes-service-node.service.consul:$1 e-potek-backup-manager-$2