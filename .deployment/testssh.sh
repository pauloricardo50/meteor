#!/bin/bash
set -e 

scp -o "IdentitiesOnly=yes" -i ./auth.pem ./testmongo.sh ubuntu@185.19.28.39:/home/ubuntu/

 ssh -o "IdentitiesOnly=yes" -i ./auth.pem ubuntu@185.19.28.39 << EOF
    chmod +x testmongo.sh
    docker pull mongo:3.6.4;
    mkdir -p /opt/mongodb/db;
    docker stop e-potek-mongodb-staging;
    docker rm e-potek-mongodb-staging;
    docker run -p 27017:27017 -v /opt/mongodb/db:/data/db --name e-potek-mongodb-staging -d mongo mongod;
    ./testmongo.sh
EOF