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
0 */1 * * * curl https://cronitor.link/aOsIJY/run -m 10 ; ~/scripts/backup_db/backup_db.sh 2>&1 | /usr/bin/logger -t backup_db && curl https://cronitor.link/aOsIJY/complete -m 10
30 12 * * * curl https://cronitor.link/qDOCtx/run -m 10 ; s3cmd ls s3://production-backups | sort | awk -F' ' '{print $NF}' | grep -E  `date +%Y-%m-%d -d "14 day ago"` | xargs -I {} s3cmd del -r "{} 2>&1 | /usr/bin/logger -t delete_old_backups " && curl https://cronitor.link/qDOCtx/complete -m 10
EOL
crontab backupCron
rm backupCron

# SETUP PAPERTRAIL
wget -qO - --header="X-Papertrail-Token: xkqkznVzfJBjb6w5Ww" \
https://papertrailapp.com/destinations/11226352/setup.sh | sudo bash