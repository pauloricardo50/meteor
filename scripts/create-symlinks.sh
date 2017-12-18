#!/bin/bash

for i in 'sAdmin' 'sApp' 'sLender' 'sWww'
  do
    ln -s ../core ../$i/imports/core
    ln -s ../core/css ../$i/client/css
    ln -s ../core/assets/private ../$i/private
    ln -s ../core/assets/public ../$i/public
  done
