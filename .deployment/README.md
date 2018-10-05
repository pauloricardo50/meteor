# Deployment with CF on swisscomdev

**Automatically deploys apps with zero downtime**

This script builds the chosen applications and pushes them in parallel on their respective application containers, for both **staging** and **production** environment, with zero downtime ;). Each application container can be configured (memory and instances) as wanted through configuration files (see below).
Smoke tests can also be run on the server once a new application is uploaded to test its stability before replacing the old one.

## Requirements

The script installs every dependency required to run. However, you first need to:

- Have [CF client](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html) installed
- Be logged in on e-potek cf org `e-potek-engineering` with **org managers** rights, and **space developer + space manager** rights on spaces `Production` and `Staging`

This will probably be changed in the future, thus no dependency will be required.

## Usage

### From root folder

Two scripts are available on root package.json:

- Deploy all applications on staging: `npm run deploy-staging`
- Deploy all applications on production: `npm run deploy-production`

### From `.deployment` folder

`npm run deploy -- [options]`

#### Options:

| Name | Alias            | Description            | Type     | Values                    |
| ---- | ---------------- | ---------------------- | -------- | ------------------------- |
| `-a` | `--applications` | Applications to deploy | array    | ['app' , 'admin', 'www']  |
| `-e` | `--environment`  | Environment            | required | {'staging', 'production'} |

#### Examples:

- Deploy _app_ and _admin_ on **staging**: `npm run deploy -- -e staging -a app admin`
- Deploy all applications on **production**: `npm run deploy -- -e production`

### Tmux environment

The script will always run in a `tmux` environment (executed using [tmuxinator](https://github.com/tmuxinator/tmuxinator)). Once the deployment is done, you can detach from tmux (Ctrl-b + d) and it will automatically kill the tmux session and remove the temp files.

If an error occurs, the script will throw the error and stop.

## Configuration

The main configuration file is located in `.deployment/settings/config.js`

### Changing applications' container config

The constant called `ENVIRONMENT_CONFIG` contains each application container config:

```javascript
export const ENVIRONMENT_CONFIG = {
  [ENVIRONMENT.STAGING]: {
    services: [SERVICES.MONGODB, SERVICES.REDIS],
    [APPLICATIONS.APP]: { appConfig: APP_CONFIGS.MB512_1i },
    [APPLICATIONS.ADMIN]: { appConfig: APP_CONFIGS.MB512_1i },
    [APPLICATIONS.WWW]: { appConfig: APP_CONFIGS.MB512_1i },
  },
  [ENVIRONMENT.PRODUCTION]: {
    services: [SERVICES.MONGODB, SERVICES.REDIS],
    [APPLICATIONS.APP]: { appConfig: APP_CONFIGS.MB512_1i },
    [APPLICATIONS.ADMIN]: { appConfig: APP_CONFIGS.MB512_1i },
    [APPLICATIONS.WWW]: { appConfig: APP_CONFIGS.MB1024_1i },
  },
};
```

**NOTE: The 'services' key is used to link an existing service to the applications. Services creation/update is not yet supported. They must be created manually in the admin console beforehand for the moment.**

Each application in environment can have a different `appConfig` (i.e. application container config). The available (but still editable) configs are defined in constant `APP_CONFIGS`:

```javascript
export const APP_CONFIGS = {
  MB512_1i: { memory: CLOUDFOUNDRY_MEMORY_LIMIT.MB512, instances: 1 },
  MB512_2i: { memory: CLOUDFOUNDRY_MEMORY_LIMIT.MB512, instances: 2 },
  MB1024_1i: { memory: CLOUDFOUNDRY_MEMORY_LIMIT.MB1024, instances: 1 },
  MB1024_2i: { memory: CLOUDFOUNDRY_MEMORY_LIMIT.MB1024, instances: 2 },
};
```

The `memory` values are imported from constant `CLOUDFOUNDRY_MEMORY_LIMIT` from file `.deployment/CloudFoundry/cloudFoundryConstants` and can also be edited:

```javascript
export const CLOUDFOUNDRY_MEMORY_LIMIT = {
  MB64: '64MB',
  MB128: '128MB',
  MB256: '256MB',
  MB512: '512MB',
  MB1024: '1024MB',
  MB2048: '2048MB',
};
```

### Environment variables

Environment variables can be set for each application and environment in the constant `APP_ENV_VARIABLES`:

```javascript
export const APP_ENV_VARIABLES = {
  [ENVIRONMENT.STAGING]: {
    [APPLICATIONS.APP]: {},
    [APPLICATIONS.ADMIN]: {},
    [APPLICATIONS.WWW]: { DISABLE_WEBSOCKETS: 1 },
  },
  [ENVIRONMENT.PRODUCTION]: {
    [APPLICATIONS.APP]: {},
    [APPLICATIONS.ADMIN]: {},
    [APPLICATIONS.WWW]: { DISABLE_WEBSOCKETS: 1 },
  },
};
```

### Smoke tests files

When deploying a new application, some smoke tests are run on the server side before killing the old application and switching to the new one. These test files must be included in the corresponding application directory: `.deployment/smokeTests/$applicationName`. They can be either `.js` or `.sh` scripts. Remember to make `.sh` scripts executable (`chmod +x $yourScript.sh`). All scripts **must be executed** in the `test.sh` script present in each application smoke test folder **AND must be included** in the `APP_SMOKE_TEST_FILES` constant:

```javascript
export const APP_SMOKE_TEST_FILES = {
  [APPLICATIONS.APP]: [
    SMOKE_TESTS_MAIN_SCRIPT,
    'test.js',
    'someOtherTest.js',
    'someTest.sh',
  ],
  [APPLICATIONS.ADMIN]: [
    SMOKE_TESTS_MAIN_SCRIPT,
    'test.js',
    'someOtherTest2.js',
  ],
  [APPLICATIONS.WWW]: [SMOKE_TESTS_MAIN_SCRIPT, 'test.js', 'someOtherTest.sh'],
};
```

### Meteor settings for environment

The meteor settings for both **staging** and **production** environment are located in their corresponding directories:

- `.deployment/staging/settings-staging.json`
- `.deployment/production/settings-production.json`

# Put applications in maintenance

A script was written to modify the `nginx.conf` config file to proxy pass requested urls to a maintenance page for each application that needs to be in maintenance state. This script also uses `blue-green-deployment` so that there's zero down-time for the `nginx` application.

_Note: the `nginx.conf` located in `.deployment/nginx/nginx/nginx.conf` config file can manually be modified to add new routes if needed. You will also need to update the `.deployment/nginx/writeNginxManifest.js` script to include the new routes in the `generateNginxManifestData` function. Further documentation on `nginx` setup is about to come soon._

## Usage

### From root folder

Four scripts are available on root package.json:

- Put given staging applications in maintenance: `npm run start-maintenance-staging -- -- [options]`
- Put given production applications in maintenance: `npm run start-maintenance-production -- -- [options]`
- Stop the maintenance for all applications in staging and production: `npm run stop-maintenance`
- Push the manually updated `nginx.conf` file: `npm run update-nginx`

**Warning: don't forget the `-- --` if you want to specify options !**

#### Options:

| Name | Alias            | Description                        | Type  | Values                   |
| ---- | ---------------- | ---------------------------------- | ----- | ------------------------ |
| `-a` | `--applications` | Applications to put to maintenance | array | ['app' , 'admin', 'www'] |

#### Examples:

- Put _app_ and _admin_ to maintenance on **staging**: `npm run start-maintenance-staging -- -- -a app admin`
- Put all applications to maintenance on **production**: `npm run start-maintenance-production`
