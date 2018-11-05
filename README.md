# e-Potek

## Setup

1.  install meteor using `curl https://install.meteor.com/ | sh`
1.  setup all microservices by using the command `meteor npm run setup`
    * Use `meteor npm run setup-clean` to empty npm cache, regenerate `package-lock`s and reset meteor
1.  run all apps on the same database by using the command `npm run run`
1.  run a single microservice by going into the microservice folder and starting it with `meteor npm start`

## Microservices

This app is composed of several microservices:

* `www` contains the presentation/marketing website
  * Runs at `localhost:3000` by default
* `app` contains the actual application where people apply for a loan
  * Runs at `localhost:4000` by default
* `admin` contains the administration interface for the application, or back-office
  * Runs at `localhost:5000` by default
* `pro` is for real-estate agents and promoters selling properties
  * Runs at `localhost:4100` by default
* `pdf` is our PDF-generating microservice
  * Runs at `localhost:5500` by default
  

More will be added later, such as `lender` and `real-estate`, for example.

## Testing

1.  run `meteor npm run test-console` to start a testing server inside a microservice folder
1.  go to localhost:X006 to see the test-runner, X is the default port for the given microservice
1.  Run E2E tests with `meteor npm run test-e2e`, which starts cypress and opens the browser to start running tests

## Repo explained

The repo is structured as follows:

* `.circleci/` contains our config for circle CI, access it [here](https://circleci.com/gh/e-Potek).
  * The config is generated inside `generateConfig.js`, and the config can be generated by doing `meteor npm run generate-circleci-configs` inside the root folder
* `.deployment/` contains our deployment setup for our servers
* `.vscode/` contains our shared settings for VSCode
* `core` contains our shared e-Potek code across microservices, it is our back-end and any other code that we need in multiple places. In all files you can import from it as a module `import sharedCode from 'core/path/to/shared/code';`.
* `microservices/` contains all our actual apps, deployed on different servers.
* `scripts/` contains our bash scripts/tools we use to manage the repo, such as setup and running multiple instances of meteor in parallel

## CI/CD

A CircleCI account is watching the `master` and `staging` branches and automatically runs tests on them and deploys them to the proper servers.

The staging branch is deployed to `XXX.staging.e-potek.ch`
The master branch is deployed to `XXX.e-potek.ch`

* When updating the Meteor version don't forget to update it in the CircleCI config also.

## Our servers

### Production

The 3 microservices are hosted at the following URLs:

* https://www.e-potek.ch
* https://app.e-potek.ch
* https://admin.e-potek.ch

### Staging

There is a single staging server hosting all copies of the microservices. They can be accessed at the following URLs:

* https://www.staging.e-potek.ch
* https://app.staging.e-potek.ch
* https://admin.staging.e-potek.ch
