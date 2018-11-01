#/bin/bash
curl https://cronitor.link/C9i0vv/run -m 10 
s3cmd mb s3://backup-e-potek-production-files-`date +%Y-%m-%d`
s3cmd sync s3://e-potek-production-files s3://backup-e-potek-production-files-`date +%Y-%m-%d`
curl https://cronitor.link/C9i0vv/complete -m 10