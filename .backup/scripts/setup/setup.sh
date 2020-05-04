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
30 16 * * * ~/scripts/backup_s3/backup_s3.sh 2>&1 | /usr/bin/logger -t backup_s3
30 10 * * * ~/scripts/backup_s3/remove_old_s3_backups.sh 2>&1 | /usr/bin/logger -t remove_old_s3_backups
EOL
crontab backupCron
rm backupCron

# SETUP PAPERTRAIL
wget -qO - --header="X-Papertrail-Token: xkqkznVzfJBjb6w5Ww" \
https://papertrailapp.com/destinations/11226352/setup.sh | sudo bash

# SETUP FAIL2BAN
sudo bash -c 'cat << EOF > /etc/fail2ban/jail.d/custom.conf 
[DEFAULT]
ignoreip = 127.0.0.1 213.3.47.70
findtime = 3600
bantime = -1
maxretry = 3

[sshd]
enabled = true
EOF'

sudo systemctl restart fail2ban

sudo bash -c 'cat << EOF >> /etc/rsyslog.conf
\$ModLoad imfile
\$InputFileName /var/log/fail2ban.log
\$InputFileTag fail2ban
\$InputFileStateFile stat-fail2ban
\$InputFileSeverity info
\$InputFileFacility local3
\$InputRunFileMonitor
EOF'

sudo service rsyslog restart
