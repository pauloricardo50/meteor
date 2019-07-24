#!/bin/bash

# How to use: 
# Run "./revokeCert.sh test@e-potek.ch"

# Revoke cert and generate new CRL
ssh exoscale-ca "bash -s" < ./revokeCertAndGenCRL.sh "$1"

# Transfer new CRL to VPN and restart service
scp exoscale-ca:~/EasyRSA-3.0.5/pki/crl.pem /tmp
scp /tmp/crl.pem exoscale-vpn:/tmp
ssh exoscale-vpn "sudo mv /tmp/crl.pem /etc/openvpn; sudo systemctl restart openvpn@server1"