#!/bin/bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

# INSTALL DEPENDENCIES
echo Installing dependencies...
$SCRIPTPATH/install-dependencies.sh

# SETTING LOCALTIME TO UTC
sudo unlink /etc/localtime
sudo ln -s /usr/share/zoneinfo/Etc/UTC /etc/localtime

# ADD BACKUP SCRIPT TO CRONTAB
cat > backupCron << EOL 
0 */1 * * * ~/scripts/backup_db/backup_db.sh 2>&1 | /usr/bin/logger -t backup_db
30 12 * * * ~/scripts/backup_db/remove_old_db_backups.sh 2>&1 | /usr/bin/logger -t remove_old_db_backups
30 16 * * * ~/scripts/backup_s3/backup_s3.sh 2>&1 | /usr/bin/logger -t backup_s3
30 10 * * * ~/scripts/backup_s3/remove_old_s3_backups.sh 2>&1 | /usr/bin/logger -t remove_old_s3_backups
EOL
crontab backupCron
rm backupCron

# SETUP PAPERTRAIL
wget -qO - --header="X-Papertrail-Token: xkqkznVzfJBjb6w5Ww" \
https://papertrailapp.com/destinations/11226352/setup.sh | sudo bash