#/bin/bash
curl https://cronitor.link/rhEGpG/run -m 10
s3cmd del --recursive --force s3://backup-e-potek-production-files-`date +%Y-%m-%d -d "1 month ago"`
s3cmd rb s3://backup-e-potek-production-files-`date +%Y-%m-%d -d "1 month ago"`
curl https://cronitor.link/rhEGpG/complete -m 10