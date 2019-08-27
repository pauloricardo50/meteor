#!/bin/bash

# Generate private key and request file for client
ssh exoscale-vpn "bash -s" < ./generateKeyAndReq.sh "$1"

# Transfer certificate request to CA
scp exoscale-vpn:~/EasyRSA-3.0.5/pki/reqs/$1.req /tmp
scp /tmp/$1.req exoscale-ca:/tmp

# Sign certificate
ssh exoscale-ca "bash -s" < ./signCert.sh "$1"

# Transfer signed certificate back to VPN
scp exoscale-ca:~/EasyRSA-3.0.5/pki/issued/$1.crt /tmp
scp /tmp/$1.crt exoscale-vpn:/tmp

# Generate OVPN file
ssh exoscale-vpn "bash -s" < ./generateOVPNFile.sh "$1"
scp exoscale-vpn:~/openvpn-clients/configs/$1.ovpn /tmp

