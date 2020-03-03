set -e
set -x

if [ -z "$MIGRATION_ADMIN_PASSWORD" ]; then
    echo "Need to set MIGRATION_ADMIN_PASSWORD"
    exit 1
fi  

bash ./pull-db.sh -e production --downloadOnly

DB_NAME=$(cat /tmp/e-potek-db-name)
mongorestore \
  --host Cluster0-shard-0/cluster0-shard-00-00-rcyrm.gcp.mongodb.net:27017,cluster0-shard-00-01-rcyrm.gcp.mongodb.net:27017,cluster0-shard-00-02-rcyrm.gcp.mongodb.net:27017 \
  --ssl \
  --username migration-admin \
  --password $MIGRATION_ADMIN_PASSWORD \
  --authenticationDatabase admin \
  --nsExclude="admin.system.*" \
  --nsFrom "${DB_NAME}.*" \
  --nsTo "prod.*" \
  --archive=/tmp/e-potek.archive \
  --gzip \
  --drop \
  -vvvv
