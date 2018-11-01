# Install backup manager on VPS

**Sets up the VPS to automatically backup production database**

This script sets up a VPS to automatically dump the **production** database every hour and save it on S3. The VPS will deploy an application on Cloudfoundry that is used to open an SSH tunnel in order to have access to the database. Additionally, the VPS creates backups of the `e-potek-production-files` S3 bucket every day.

## Credentials

In order to make this script work, you need to provide credentials:

- RSA private key to ssh to the VPS
- Cloudfoundry credentials to deploy the SSH tunnel
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

### Cloudfoundry credentials

Ask me (quentin@e-potek.ch) the cloudfoundry credentials file `.cf-credentials` and copy it to `.backup/scripts/cf/.cf-credentials`

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

- Every hour: dump **production** database and save it on S3 bucket `s3://production-backups`
- At 12:30 UTC: delete 14 days old DB backups
- At 16:30 UTC: create copy of `e-potek-production-files` S3 bucket into a new bucket
- At 10:30 UTC: delete 30 days old `e-potek-production-files` S3 backups

Each CRON job is monitored on https://cronitor.io

```
0 */1 * * * ~/scripts/backup_db/backup_db.sh 2>&1 | /usr/bin/logger -t backup_db
30 12 * * * ~/scripts/backup_db/remove_old_db_backups.sh 2>&1 | /usr/bin/logger -t remove_old_db_backups
30 16 * * * ~/scripts/backup_s3/backup_s3.sh 2>&1 | /usr/bin/logger -t backup_s3
30 10 * * * ~/scripts/backup_s3/remove_old_s3_backups.sh 2>&1 | /usr/bin/logger -t remove_old_s3_backups
```
