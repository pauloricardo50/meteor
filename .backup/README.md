# Install backup manager on VPS

**Sets up the VPS to automatically backup production database**

This script sets up a VPS to automatically dump the **production** database every hour and save it on S3. The VPS will deploy an application on Cloudfoundry that is used to open an SSH tunnel in order to have access to the database.

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
- At 12:30 UTC: delete 14 days old backups

Each CRON job is monitored on https://cronitor.io

```
0 */1 * * * curl https://cronitor.link/aOsIJY/run -m 10 ; ~/scripts/backup_db/backup_db.sh && curl https://cronitor.link/aOsIJY/complete -m 10
30 12 * * * curl https://cronitor.link/qDOCtx/run -m 10 ; s3cmd ls s3://production-backups | sort | awk -F' ' '{print $NF}' | grep -E  `date +%Y-%m-%d -d "14 day ago"` | xargs -n 1 s3cmd del -r && curl https://cronitor.link/qDOCtx/complete -m 10
```
