# e-Potek

This app is composed of several microservices:

* `www` contains the presentation page
* `app` contains the actual application where people apply
* `admin` contains the administration interface for the application

### How do I get set up?

* Initial setup

1. install meteor using `curl https://install.meteor.com/ | sh`
1. setup all microservices by running the setup script: `./scripts/setup.sh`, this does the following things:
   * for each microservice:
     * install all `node_modules`
     * create symlinks for `core`
     * create symlinks for `core/assets/css`
     * create symlinks for `core/assets/public`
     * create symlinks for `core/assets/private`
     * install npm packages (use flag `-c` to clean and clear npm packages)
     * reset meteor
     * generate language files based on the components in each microservice
   * install core npm packages
1. run all apps on the same database by using the run script: `./scripts/run.sh`
1. run a single microservice by going into the microservice folder and starting it with `meteor npm start`

* How to run tests

1. run `meteor yarn run test` to start a testing server
1. go to localhost:4000 to see the test-runner

### CI/CD

A CircleCI account is watching the `master` and `staging` branches and automatically runs tests on them and deploys them to the proper servers.

The staging branch is deployed to staging.e-potek.ch
The master branch is deployed to e-potek.ch

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
