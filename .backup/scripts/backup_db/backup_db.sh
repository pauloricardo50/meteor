#!/bin/bash

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

$SCRIPTPATH/../cf/cf-login.sh Production
$SCRIPTPATH/../cf/cf-deploy-ssh-tunnel.sh

DATABASE="$(cf env e-potek-ssh-tunnel-backup-manager| sed -n  "s/\"database\":.*\"\(.*\)\"/\1/p" | grep -Eo "[A-Za-z0-9]+")"
USERNAME="$(cf env e-potek-ssh-tunnel-backup-manager| sed -n  "s/\"username\":.*\"\(.*\)\"/\1/p" | grep -Eo "[A-Za-z0-9]+")"
PASSWORD="$(cf env e-potek-ssh-tunnel-backup-manager| sed -n  "s/\"password\":.*\"\(.*\)\"/\1/p" | grep -Eo "[A-Za-z0-9]+")"
PORT="$(cf env e-potek-ssh-tunnel-backup-manager| sed -n  "s/\"ports\":.*\"\(.*\)\"/\1/p" | grep -Eo "[0-9]+" | head -1)"

echo "Waiting for SSH tunnel to be established..."
TRY_COUNT=0
TRY_LIMIT=10
tmux new-session -d -s "ssh-tunnel" $SCRIPTPATH/../cf/cf-connect-ssh-tunnel.sh $PORT
until nc -vz localhost $PORT >/dev/null 2>&1
do
    sleep 1
    TRY_COUNT=$((TRY_COUNT + 1))
    if (( TRY_COUNT > TRY_LIMIT )); then
        echo "SSH tunnel cannot be established"
        tmux kill-session -t ssh-tunnel
        cf delete e-potek-ssh-tunnel-backup-manager -r -f
        exit;
    fi
done
echo "SSH tunnel established!"

$SCRIPTPATH/dump_db.sh $PORT $DATABASE $USERNAME $PASSWORD

echo "Closing SSH tunnel..."
tmux kill-session -t ssh-tunnel
echo "SSH tunnel closed."

echo "Deleting app..."
cf delete e-potek-ssh-tunnel-backup-manager -r -f