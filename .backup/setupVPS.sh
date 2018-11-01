#!/bin/bash
ssh exoscale-backup-manager 'rm -rf ~/scripts'
scp -r ./scripts/ exoscale-backup-manager:~/scripts/
ssh exoscale-backup-manager 'cd ~/scripts/setup; ./setup.sh'
