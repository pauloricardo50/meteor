# Authentication

## SSH

The `mup` scripts look for an ssh key at `~/.ssh/epotek`. You can create it by running `ssh-keygen -t rsa -b 4096 -C "your_email@example.com"`. Please note that `ssh-keygen` doesn't accept paths with the `~` character, so you will need to use the full path to your home folder.

Add the public key to Google Cloud by going to https://console.cloud.google.com/compute/metadata/sshKeys?project=e-potek-1499177443071 and adding your ssh key.

## Google Cloud API

Go to https://console.cloud.google.com/apis/credentials/serviceaccountkey and `Compute Engine`, and `JSON` key type, and download it. Move the file to be at `mup/credentials.json`.

This is used for:
- Updating list of servers

## Atlas API keys

Go to https://cloud.mongodb.com/v2/5e31aad95538553602af0c98#access/apiKeys > `Manage` > `Create API Key`.

The api key must have the `Project Owner` permission to be able to update the IP whitelist.

# Zones

There are 3 zones in the europe-west6 region. Unfortionately, their [Nodejs client doesn't work](https://github.com/googleapis/nodejs-compute/issues/352) with instance groups that use multiple zones. Until that is fixed, we only use zone a.

# VM Instances

## Config

- Disk: `30GB`
- OS: Ubuntu 18 LTS
- Memory: Building the docker image uses a large amount of ram due to the size of the bundles. The 

## SSH Access

You can add your public ssh key by going to the `Compute Engine` section > `Metadata` > `SSH Keys` tab.

# Load balancing and SSL termination

## Backends

The target is a network endpoint group named `e-potek-staging` or `e-potek-prod`. It is located in zone `a` of the europe-6 region. All Virtual Machines part of the network endpoint should be in this region.

When using a network endpoint group the balancing mode is always `rate`. Since it isn't important for us, we can set a high number for the maximum such as `10,000`.

For sticky sessions we set `Session afinity` to `Client IP`.

### Healthcheck

Backends are required to have a healthcheck. Since the nginx instance will send an error status code if there is no `HOST`, we set it to the `www` subdomain.

## Adding Target

1. On the Network Endpoint Group page, select the group you want, and click `Add network`. 
2. Click on add network endpoint
3. Click add network endpoint, and enter in the VM's private IP. The public IP address should not be used as you will probably be charged extra for networking.

## Certificate

We use a google managed SSL certificate. It does not support wildcard certificates, so each subdomain is listed.

For it to be verified:
- The DNS entries for each domain have to be pointing to the load balancer's IP Address
- The certificate must be in use by the load balancer with the IP address
- A `CAA` record must be added for each domain with the value:
```
0 issue "letsencrypt.org"
0 issue "pki.goog"
```

# Scripts

## update-servers

We have two files, one for each environment, that has a list of the servers with their IP address. To update the list, run `node update-servers.js`.

## status

Shows status of servers, docker, nginx, and the Meteor apps for each environment. Run `node status.js --overview`. For more details, run `node status.js` instead.

## update-atlas-whitelist

Updates the Atlas ip whitelist. Currently it only adds addresses; it does not remove unused addresses.

To use, set the `ATLAS_PUBLIC_KEY` and `ATLAS_PRIVATE_KEY` env vars with the values from creating the api key. Then run `node update-atlas-whitelist`
