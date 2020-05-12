#!/bin/bash

# This script creates symlinks from all the subfiles and subfolders of a 
# source directory to a destination directory without linking the root 
# directory itself.
#
# This allows to add unlinked files/directories to the destination directory.
#
# Usage : link.sh source destination 
# Note : the destination directory must exist !


source=$1
destination=$2


files=( $(find $source -maxdepth 1 -type f) )
folders=( $(find $source -maxdepth 1 -mindepth 1 -type d) )

prefix="$source"

for i in "${folders[@]}"
do
    ln -sv ../../$i $destination${i#$prefix}
done

for i in "${files[@]}"
do
    ln -svf ../../$i $destination${i#$prefix}
done
