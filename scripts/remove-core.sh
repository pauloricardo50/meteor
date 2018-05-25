#!/bin/bash

# This script removes all copied files from core to the other microservices
# It's helpful when trying to find code without the duplicates showing up

# Remove all symlinks in the parent directory
find .. -type l -exec unlink {} \;

for i in 'admin' 'app' 'lender' 'www'
  do
    ( cd ../microservices/$i && rm -rf ./public && rm -rf ./private );
  done
  