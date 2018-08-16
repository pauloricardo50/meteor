#!/bin/bash
docker exec -i e-potek-mongodb-staging mongo admin --eval "db.createUser({ user: 'admin', pwd: 'password', roles: [ { role: 'userAdminAnyDatabase', db: 'admin' } ] });"
