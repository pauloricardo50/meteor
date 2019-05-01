#!bin/bash

mv /tmp/$1.crt ~/openvpn-clients/files
cd ~/openvpn-clients
./gen_config.sh $1