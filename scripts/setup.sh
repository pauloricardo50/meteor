#!/bin/bash

# This scripts does a bunch of repetitive setup for each microservice
# such as installing things, symlinks, copying necessary folders

start=`date +%s`
echo "Preparing e-Potek :]"
DO_CLEAN=false

# check for flag arguments
while getopts ":c" opt; do
  case $opt in
  c)
    DO_CLEAN=true
    echo "-c flag set: Also hard cleaning up all node_modules" >&2
    ;;
  \?)
    echo "Invalid option: -$OPTARG, exiting... (please try again though)" >&2
    exit
    ;;
 esac
done

if [[ $DO_CLEAN == true ]];
then
  echo "Cleaning and installing root npm packages"
  ( cd ../ && rm -f ./package-lock.json && rm -rf node_modules/ && npm cache clear -fq );
fi

echo "Installing npm packages in root"
( cd .. && meteor npm i -q );

echo "Setting up sort-import style"
ln -s ../plugins/import-sort-style-epotek ../node_modules/.

end=`date +%s`
runtime=$((end-start))

echo "e-Potek is ready! It took $runtime seconds"
