#!/bin/bash

# Install sshpass if not installed
sshpass=$(../scripts/checkPackage.sh sshpass)

if [ "$sshpass" = '0' ]; then
    ./install-sshpass.sh
fi

cf target Nginx
host=$(cf curl /v2/info | grep app_ssh_endpoint  | grep -Eo "(ssh\.[^\:]+)")
port=$(cf curl /v2/info | grep app_ssh_endpoint  | grep -Eo "ssh\..*\:(\d+)" | grep -Eo "\d{4}")
appGuid=$(cf app e-potek-nginx --guid)
password=$(cf ssh-code)
sshpass -p $password scp -P $port -oUser=cf:$appGuid/0 ./README.md $host:REAMDE.md