#!/bin/bash

MICROSERVICES="www app admin"
SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"
ME=`basename "$0"`

if [ "$1" = "" ]; then
  echo "# Please use the microservice(s) you want to deploy to: ./$ME $MICROSERVICES"
  echo "# Use 'all' as the first argument to deploy to all"
  exit 1
fi

if [ "$1" != "all" ]; then
  MICROSERVICES=$1
fi

# Create logs folder if doesn't exist
if [ ! -d "logs" ]; then
  mkdir $SCRIPT_PATH/logs
fi

# Check for authentication file
if [ ! -f "$SCRIPT_PATH/auth.pem" ]; then
  echo "# You do not have an auth.pem file which is used to authenticate to the microservices"
  exit 1
fi

echo
echo "# e-Potek Deployment Script"
echo "# Now installing npm dependencies"

for i in $MICROSERVICES; do
  cd $SCRIPT_PATH/../microservices/$i
  meteor npm i
  meteor npm run prestart
done

# Going back to the main folder after we installed npm dependencies
cd $SCRIPT_PATH;

echo "# NPM dependencies installed, now deploying each microservice..."

# Run deployments in parallel locally if you provide a second argument "ttab"
if [ "$2" = "ttab" ]; then
  echo "'ttab' flag detected, deploying microservices in parallel..."
  for i in $MICROSERVICES; do
    ttab -t "Deployment of $i" "mup deploy --config mup-$i.js --settings settings-staging.json"
  done
else
  for i in $MICROSERVICES; do
    echo $i;
    echo "# [$i] deploying microservice deployment ..."
    # mup deploy --config "mup-$i.js" --settings settings-staging.json 2> "$SCRIPT_PATH/logs/errors-$i.log" > "$SCRIPT_PATH/logs/deploy-$i.log" &
    mup deploy --config "mup-$i.js" --settings settings-staging.json 
  done
fi
