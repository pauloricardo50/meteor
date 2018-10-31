#!/bin/bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

# INSTALL DEPENDENCIES
echo Installing dependencies...
$SCRIPTPATH/install-dependencies.sh

# SETTING LOCALTIME TO UTC
sudo unlink /etc/localtime
sudo ln -s /usr/share/zoneinfo/Etc/UTC /etc/localtime

# ADD BACKUP SCRIPT TO CRONTAB
echo "0 */1 * * * curl https://cronitor.link/aOsIJY/run -m 10 ; ~/scripts/backup_db/backup_db.sh && curl https://cronitor.link/aOsIJY/complete -m 10" > backupCron
crontab backupCron
rm backupCron
