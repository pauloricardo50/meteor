#!/bin/bash
source ./colors.sh

echo -e "$TITLE_START SETTING UP ROOT $TITLE_END"

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
  echo -e "$SECTION_START Cleaning and installing root npm packages $SECTION_END"
  ( cd ../ && rm -f ./package-lock.json && rm -rf node_modules/ && npm cache clear -fq );
fi

echo -e "$SECTION_START Installing npm packages in root $SECTION_END"
( cd .. && meteor npm i -q );

echo -e "$SECTION_START Setting up sort-import style $SECTION_END"
ln -s ../plugins/import-sort-style-epotek ../node_modules/.
