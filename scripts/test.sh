#!/usr/bin/env bash

while getopts ":c" opt; do
  case $opt in
  c)
    # This is the hard clean variant in case node_modules has integrity problems
    echo "wtf" >&2
    doClean=true
    ;;
  esac
done

if [[ doClean ]];
  then
    echo "do clean! $doClean"
  else
    echo "don't clean! $doClean"
fi
