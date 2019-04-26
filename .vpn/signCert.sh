#!/bin/bash

cd ~/EasyRSA-3.0.5/
rm ./pki/reqs/$1.req
./easyrsa import-req /tmp/$1.req $1
echo "yes
epotekca" | ./easyrsa sign-req client $1