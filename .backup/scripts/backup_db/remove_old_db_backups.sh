#!/bin/bash

curl https://cronitor.link/qDOCtx/run -m 10
s3cmd ls s3://production-backups | sort | awk -F' ' '{print $NF}' | grep -E  `date +%Y-%m-%d -d "14 day ago"` | xargs -I {} s3cmd del -r "{}"
curl https://cronitor.link/qDOCtx/complete -m 10