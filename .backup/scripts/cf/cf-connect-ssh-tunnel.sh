#!/bin/bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

cf ssh -L $1:kubernetes-service-node.service.consul:$1 e-potek-ssh-tunnel-backup-manager-$2