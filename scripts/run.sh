#!/bin/bash

# This script starts all microservices and points them to the same mongoDB instance

echo Running e-Potek...

# Check if ttab is installed
if ! type "ttab" > /dev/null; then
  # install ttab if not
  echo Installing ttab
  npm i -g ttab
fi

# Start each app in its own tab
for i in "www" "app" "admin-temp" "lender"
  do
    # Make them all connect to the mongoDB instance created by the first app (epotek-www, running at localhost:3000)
    if [[ $i == "www" ]]; then
        ttab -t $i -d ../microservices/$i 'meteor npm start'
    else
      ttab -t $i -d ../microservices/$i 'export MONGO_URL=mongodb://localhost:3001/meteor; meteor npm start'
    fi

  done
