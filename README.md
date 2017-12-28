# e-Potek

This app is composed of several microservices:
- `www` contains the presentation page
- `app` contains the actual application
- `admin` contains the administration interface for the application

### How do I get set up? ###

* Initial setup

1. install meteor using `curl https://install.meteor.com/ | sh`
1. run `meteor npm install yarn -g`.
1. run `meteor yarn install`
1. run `meteor yarn start`
1. go to localhost:3000 to use the app

* How to run tests

1. run `meteor yarn run test` to start a testing server
1. go to localhost:4000 to see the test-runner


### CI/CD ###

A CircleCI account is watching the `master` and `staging` branches and automatically runs tests on them and deploys them to the proper servers.

The staging branch is deployed to staging.e-potek.ch
The master branch is deployed to e-potek.ch

### Other stuff ###

* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)
