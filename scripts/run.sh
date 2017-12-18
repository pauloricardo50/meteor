#!/bin/bash

echo Running e-Potek...

# Check if ttab is installed
if ! type "ttab" > /dev/null; then
  # install ttab if not
  echo Installing ttab
  npm i -g ttab
fi

# Start each app in its own tab
for i in 'sWww' 'sApp' 'sAdmin' 'sLender'
  do
    # Make them all connect to the mongoDB instance created by the first app (sWww, running at localhost:3000)
    ttab -t $i -d ../$i 'MONGO_URL=mongodb://localhost:3001/meteor; meteor npm start'
  done
