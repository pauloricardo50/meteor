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
0 */1 * * * curl https://cronitor.link/aOsIJY/run -m 10 ; ~/scripts/backup_db/backup_db.sh && curl https://cronitor.link/aOsIJY/complete -m 10
30 12 * * * curl https://cronitor.link/qDOCtx/run -m 10 ; s3cmd ls s3://production-backups | sort | awk -F' ' '{print $NF}' | grep -E  `date +%Y-%m-%d -d "14 day ago"` | xargs -n 1 s3cmd del -r && curl https://cronitor.link/qDOCtx/complete -m 10
EOL
crontab backupCron
rm backupCron
