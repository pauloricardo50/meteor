#!/bin/bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
DATE="$(date +"%Y-%m-%d_%H:%M")"

echo "Creating database dump..."
mongodump -h localhost:$1 -d $2 -u $3 -p $4 -o $SCRIPTPATH/backup_$DATE

s3cmd put --recursive $SCRIPTPATH/backup_$DATE/ s3://production-backups/backup_$DATE/

rm -rf $SCRIPTPATH/backup_$DATE