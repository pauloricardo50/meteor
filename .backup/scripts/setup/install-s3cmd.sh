#!/bin/bash
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

# sudo apt-get install -y s3cmd

EXO_SOS_KEY="$(cat $SCRIPTPATH/.exoscale-credentials | sed -n "s/^key:\([^\s]*\)/\1/p")" 
EXO_SOS_SECRET="$(cat $SCRIPTPATH/.exoscale-credentials | sed -n "s/^secret:\([^\s]*\)/\1/p")" 


cat > ~/.s3cfg << EOL
[default]
host_base = sos-ch-dk-2.exo.io
host_bucket = %(bucket)s.sos-ch-dk-2.exo.io
access_key = $EXO_SOS_KEY
secret_key = $EXO_SOS_SECRET
use_https = True
EOL

