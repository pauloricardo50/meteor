#!/bin/bash

# Install ngrok on your machine via ngrok.com, login with your GitHub account
# It will download a `ngrok` executable, copy it to /usr/local/bin (on macOS)
# for it to be available globally

# Read this if meteor does weird things: https://forums.meteor.com/t/accounts-how-to-configure-the-redirect-uri-which-meteor-calls/27770/8
echo "Starting ngrok server at port 3000"

# Use region EU for faster server if dev is in EU
# Use -bind-tls to only have a https version of the site
ngrok http -region=eu -bind-tls=true 3000