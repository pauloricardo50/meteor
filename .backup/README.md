# Install backup manager on VPS

**Sets up the VPS to automatically backup production database**

This script sets up a VPS to backup the the `e-potek-production-files` S3 bucket every day and save them on S3.

## Credentials

In order to make this script work, you need to provide credentials:

- RSA private key to ssh to the VPS
- S3 keys to save the backups to the bucket

### RSA private key

Ask me (quentin@e-potek.ch) the private RSA key to connect to exoscale, copy it (&#8984;+C) and execute the following commands:

```bash
pbpaste > ~/.ssh/id_rsa_exoscale_backup_manager
chmod 400 ~/.ssh/id_rsa_exoscale_backup_manager
cat >> ~/.ssh/config << EOL
Host exoscale-backup-manager
	HostName 185.19.29.17
	User ubuntu
	IdentityFile ~/.ssh/id_rsa_exoscale_backup_manager
EOL
```

### S3 keys

Get your Exoscale API key and secret and create the file `.backup/setup/.exoscale-credentials`:

```
key: $YOUR_API_KEY
secret: $YOUR_API_SECRET
```

## Setup the VPS

Once you have all the required credentials, simply execute `setupVPS.sh`.

## CRON jobs

Two CRON jobs are set on the VPS:

- At 16:30 UTC: create copy of `e-potek-production-files` S3 bucket into a new bucket
- At 10:30 UTC: delete 30 days old `e-potek-production-files` S3 backups

Each CRON job is monitored on https://cronitor.io

```
30 16 * * * ~/scripts/backup_s3/backup_s3.sh 2>&1 | /usr/bin/logger -t backup_s3
30 10 * * * ~/scripts/backup_s3/remove_old_s3_backups.sh 2>&1 | /usr/bin/logger -t remove_old_s3_backups
```
