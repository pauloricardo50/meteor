#!/bin/bash

# 1. Identify unique DB id that you want to restore by doing
# s3cmd ls s3://production-backups

# 2. download it (for example)
# s3cmd get --recursive s3://production-backups/backup_2019-08-05_07:00/

# 3. Restore it to your local meteor running instance (change the port to your running instance +1)
# mongorestore --drop -h localhost:5001 -d meteor ./cd900b98