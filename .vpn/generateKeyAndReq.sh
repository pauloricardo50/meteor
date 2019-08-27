#!/bin/bash

cd ~/EasyRSA-3.0.5/
rm ./pki/private/$1.key
rm ./pki/reqs.$.req
echo "$1" | ./easyrsa gen-req $1 nopass

cp ~/EasyRSA-3.0.5/pki/private/$1.key ~/openvpn-clients/files/