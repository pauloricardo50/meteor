#!/usr/bin/env bash

echo Deploying e-Potek staging microservices...

# Setup mup for each app (can't do it in parallel or proxy configuration breaks down)
for i in "www" "app" "admin"
  do
    echo "Setting up mup for $i..."
    ( cd $i && mup setup )
  done

echo "Setup done, now deploying each app..."

for i in "www" "app" "admin"
  do
    ttab -t "Deployment of $i" -d . "mup deploy --config mup-$i.js --settings settings-staging.json"
  done
