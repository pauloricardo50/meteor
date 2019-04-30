#!/bin/bash

cd EasyRSA-3.0.5
echo "yes
epotekca" | ./easyrsa revoke $1
echo "epotekca
" | ./easyrsa gen-crl