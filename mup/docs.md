# Authentication

## SSH

The `mup` scripts look for an ssh key at `~/.ssh/epotek`. You can create it by running `ssh-keygen -t rsa -b 4096 -C "your_email@example.com"`. Please note that `ssh-keygen` doesn't accept paths with the `~` character, so you will need to use the full path to your home folder.

Add the public key to Google Cloud by going to https://console.cloud.google.com/compute/metadata/sshKeys?project=e-potek-1499177443071 and adding your ssh key.

## Google Cloud API

Both of these are needed to deploy.

### Engine Credentials
Go to https://console.cloud.google.com/apis/credentials/serviceaccountkey and `Compute Engine`, and `JSON` key type, and download it. Move the file to `mup/configs/credentials.json`.

This is used for updating the lists of servers.

### Private Repository Credentials

Go to the `private-registry` [service account](https://console.cloud.google.com/iam-admin/serviceaccounts/details/113489271703975496945?project=e-potek-1499177443071), select `Edit`, and click on `Create Key`. Download the key and move it to `mup/configs/registry-key.json`.

This is used on the servers to authenticate docker with the private registry.

## Atlas API keys

Go to https://cloud.mongodb.com/v2/5e31aad95538553602af0c98#access/apiKeys > `Manage` > `Create API Key`.

The api key must have the `Project Owner` permission to be able to update the IP whitelist.

Store the keys in `configs/atlas-auth.json` in the format:
```
{
  "publicKey": "abcdefg",
  "privateKey": "1111111-aaaa-1111-11aa-11111111111"
}

```

This is used to authenticate 

## Atlas Database User

This user is needed to connect to Atlas for the `atlas-migrate.sh` script or to connect with the mongo shell.

1. Go to the [Database Access](https://cloud.mongodb.com/v2/5e31aad95538553602af0c98#security/database/users) page for the Atlas cluster
2. Click Add New User
3. Put in a username that shows it is yours, and create a password. You will not be shown the password later, though you can change it.
4. Select `Read and Write from any database`
5. Create a file in `mup/configs/mongo-auth.json` with the content:
```json
{
  "username": "username",
  "password": "password"
}
```

To connect to the database from your computer, you also need to [whitelist your IP address](https://cloud.mongodb.com/v2/5e31aad95538553602af0c98#security/network/whitelist). 

# VM Instances

## Config

- Disk: `30GB`
- OS: Ubuntu 18 LTS
- Allow HTTP traffic
- Label: `env` with a value of `staging`, `production`, or `api`
- Under networking, add a `http-server` network tag. If this is for the production environment, add a `prod` network tag also 
- Under networking, select the default network interface
  - Change `Primary internal IP` to `Reserve static ip address` and name it after the instance
  - Network Service Tier can be changed to `Standard`

After creating, go to the instance group, select `Edit`, and use the `Add an instance` dropdown to select the new instance.

## IP Addresses

We use ephemeral external IP address for most instances. The ephemeral external IP address changes whenever the server is stoped or restarted. When it changes, we will need to update the IP whitelist in Atlas.

All servers should be configured with a static internal IP address. Once we finish setting up [vpc peering](https://docs.atlas.mongodb.com/security-vpc-peering/), we can use the internal IP address instead, which does not change.

Mup connects to the instances using the external IP address. All scripts that run mup also run the `update-servers.js` script to get the latest IP address. If you run `mup` yourself, you might want to run `update-servers` first.

## Setting up additional servers

1. Run `node update-atlas-whitelist`
2. Run `node run-all -e <env with changes> setup`
3. Run `node run-all -e <env with changes> proxy reconfig-shared`
4. Run `node run-all -e <env with changes> deploy`. If you are sure the last deploy was done from your computer, you could use the `--cached-build` option to skip building the apps.

# Load balancing and SSL termination

## Backends

The targets are unmanaged instance groups named `staging`, `production`, and `api`. They are located in zone `a` of the europe-6 region. To support more zones, we would need to add additional unmanaged instance groups in the additional zones, and add them as backends to the backend services in the load balancer.

For sticky sessions we set `Session afinity` to `Generated Cookie`. Sticky sessions are disabled for the production api.

### Routing to healthy instnaces

Backends are required to have a healthcheck. In the global nginx config we added a host only used for the health check: `instance-healthcheck.epotek-internal.net`. It responds with the 200 status code if the nginx instance is running. This health check ensures requests are only sent to healthy vm's, but it doesn't work for detecting healthy instances of the microservice.

To send requests to a healthy instance of a microservice, we also load balance between the vm's in the instance group using nginx. When receiving a request from the Google Cloud load balancer, it will try one of the instances (using sticky sessions), and if it is down it will try one of the other instances of the microservice.

For the nginx instance to communicate with other servers, we have a firewall rule named mup-prod-internal. For this firewall rule to apply to a server, it must have the `prod` network tag. To add an additional microservice you will need to open an additional port. To find the port, run `mup validate --show --config <path to mup config>` and check the value of `app.env.PORT`. Then add the port to the [mup-prod-internal](https://console.cloud.google.com/networking/firewalls/details/prod-mup-internal?project=e-potek-1499177443071) firewall rule.

## Certificate

We use a google managed SSL certificate. It does not support wildcard certificates, so each subdomain is listed.

For it to be verified:
- The DNS entries for each domain have to be pointing to the load balancer's IP Address
- The certificate must be in use by the load balancer with the IP address
- A `CAA` record must be added for each domain. If wildcard subdomains are used for the `A` record, then the `CAA` record must also use a wildcard for the `A` record to work.  The value should be:
```
0 issue "letsencrypt.org"
0 issue "pki.goog"
```

# Scripts

## update-servers

We have three JSON files, one for each environment in addition to one for the api, that has a list of the servers with their IP address. To update the list, run `node update-servers.js`.

## status

Shows status of servers, docker, nginx, and the Meteor apps for each environment. Run `node status.js --overview`. For more details, run `node status.js` instead.

## update-atlas-whitelist

Updates the Atlas ip whitelist. Currently it only adds addresses; it does not remove unused addresses.

To use, run `node update-atlas-whitelist`

This script should be run whenever servers are started, restarted, or added to a instance group, until we set up the vpc peering and switch to whitelisting their private IP address.

## Run mup command for all microservices

The `run-all` script will execute a mup command for each microservice in the environment(s). 

Examples:
```
node run-all -e prod logs logs --tail 10 -t
node run-all -e api proxy reconfig-shared
node run-all -e all validate
node run-all -e all --parallel restart
node run-all -e staging --apps pro,admin deploy --verbose
```

Run `node run-all --help` for usage instructions.

## Run mup manually

`mup` unfortionately resolves relative paths from the path the command is run instead of the path the config is at. It is best to always run `mup` from the same folder that has the mup config.

Run `mup --config <microservice config path> <commands>`. For example:
```
mup --config prod.mup.js logs --tail 200 -t --follow
mup --config api.mup.js proxy nginx-config
```

## Mup Commands

These are some of the useful commands:

```bash
# Check for problems with the config
mup validate

# View the generated config
mup validate --show

# Logs (with options to tail, follow, and show timestamp)
mup logs --tail 200 --follow -t

# Update env vars, settings.json, and other options without deploying
mup reconfig
```

## SSH

Run `mup --config <any microservice mup config> ssh` to get a list of servers. Use a config for the environment you want to SSH into. If there is only one server, it will SSH you into it instead of showing a list.

To SSH into a specific server, run `mup --config <any microservice mup config> ssh <server name>`.

## Deploy

To deploy an environment, run
```
node run-all -e <environment name> deploy
```

To deploy a specific app, run
```
node run-all -e <environment name> --apps <app name> deploy
```

## Mongo Shell

To connect a mongo shell to the Atlas cluster, run `node mongo-shell`. Make sure you have already created a database user and whitelisted your IP address in Atlas.

## mongodump

To dump a database, run `node pull-mongo -e <environment name>`.

It will show the location the archive is created. The `--out` option can be used to give the path to create the archive at, for example `--out /tmp/backup.archive`.

A file at `<out path>.db-name.txt` will be created with the name of the database that was dumped. This file must exist when restoring the database with the `restore-mongo` script.

## mongorestore

To restore a database from an archive, run `node restore-mongo -e <environment name> --archivePath path/to/archive.archive`.

Environments allowed are:
- staging
- local. Restores to the backend database. The backend microservice must be running first.
