#!/bin/bash

source=$1
destination=$2


files=( $(find $source -type f -maxdepth 1) )
folders=( $(find $source -type d -maxdepth 1 -mindepth 1) )

prefix="$source"

for i in "${folders[@]}"
do
    ln -sv ../../$i $destination${i#$prefix}
done

for i in "${files[@]}"
do
    ln -svf ../../$i $destination${i#$prefix}
done

