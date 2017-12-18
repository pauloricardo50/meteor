#!/bin/bash

start=`date +%s`
echo Preparing e-Potek...

# Remove all symlinks in the parent directory
find .. -type l -exec unlink {} \;

# Create all symlinks to core in every microservice
for i in 'sAdmin' 'sApp' 'sLender' 'sWww'
  do
    echo Preparing $i...

    echo Creating symlinks
    ln -s ../../core ../$i/imports/core
    ln -s ../../core/assets/css ../$i/client/css
    ln -s ../core/assets/private ../$i/private
    ln -s ../core/.babelrc ../$i/.babelrc

    # public folder can't have any symlink: https://github.com/meteor/meteor/issues/7013
    echo Creating public folder
    rm -rf ../$i/public
    cp -a ../core/assets/public ../$i/public

    echo Installing clean node_modules
    ( cd ../$i && rm -rf node_modules/ && meteor npm install )

    # This is the hard clean variant in case node_modules has integrity problems
    ( cd ../$i && rm ./package-lock.json && rm -rf node_modules/ && npm cache clear --force && meteor npm install )

  done

end=`date +%s`
runtime=$((end-start))

echo e-Potek is ready! It took $runtime seconds
