#!/bin/bash

# Remove all symlinks in the parent directory
find .. -type l -exec unlink {} \;

# Create all symlinks to core in every microservice
for i in 'sAdmin' 'sApp' 'sLender' 'sWww'
  do
    echo creating symlinks for $i
    ln -s ../../core ../$i/imports/core
    ln -s ../../core/assets/css ../$i/client/css
    ln -s ../core/assets/private ../$i/private
    ln -s ../core/assets/public ../$i/public
    ln -s ../core/.babelrc ../$i/.babelrc
  done
