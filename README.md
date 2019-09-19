# e-Potek

## Setup

1.  install meteor using `curl https://install.meteor.com/ | sh`
1.  setup all microservices by using the command `meteor npm run setup`
    - Use `meteor npm run setup-clean` to empty npm cache, regenerate `package-lock`s and reset meteor
1.  run a single microservice by going into the microservice folder and starting it with `meteor npm start`
    - run more apps as needed by repeating this command within each microservice folder
1. When running the apps with a clean DB, a few demo users will be created that you can use to quickly log in
    - 2 `dev` users will be created, `florian@e-potek.ch` and `quentin@e-potek.ch`
    - Their passwords are all `12345`

## Microservices

This app is composed of several microservices:

- `backend` contains our shared backend. All of the other front-end microservices communicate with it
  - Runs at `localhost:5500` by default
- `www` contains the presentation/marketing website
  - Runs at `localhost:3000` by default
- `app` contains the actual application where people apply for a loan
  - Runs at `localhost:4000` by default
- `admin` contains the administration interface for the application, or back-office
  - Runs at `localhost:5000` by default
- `pro` is for real-estate agents and promoters selling properties
  - Runs at `localhost:4100` by default

More could be added later, such as `lender` and `real-estate`, for example.

## Testing

1.  run `meteor npm t` to run tests in a microservice
1.  go to localhost:X005 to see the test-runner, X is the default port for the given microservice
1.  Run E2E tests with `meteor npm run test-e2e`, which starts cypress and opens the browser to start running tests

## Repo explained

The repo is structured as follows:

- `.circleci/` contains our config for circle CI, access it [here](https://circleci.com/gh/e-Potek).
  - The config is generated inside `generateConfig.js`, and the config can be generated by doing `meteor npm run generate-circleci-configs` inside the root folder
- `.deployment/` contains our deployment setup for our servers
- `.vscode/` contains our shared settings for VSCode
- `core` contains our shared e-Potek code across microservices, it is our back-end and any other code that we need in multiple places. In all files you can import from it as a module `import sharedCode from 'core/path/to/shared/code';`.
- `microservices/` contains all our actual apps, deployed on different servers.
- `scripts/` contains our bash scripts/tools we use to manage the repo, such as setup and running multiple instances of meteor in parallel

## CI/CD

A CircleCI account is watching the `master` and `staging` branches and automatically runs tests on them.

- When updating the Meteor version don't forget to update it in the CircleCI config also.

## Our servers

### Production

The 3 microservices are hosted at the following URLs:

- https://www.e-potek.ch
- https://app.e-potek.ch
- https://admin.e-potek.ch

### Staging

There is a single staging server hosting all copies of the microservices. They can be accessed at the following URLs:

- https://www.staging.e-potek.ch
- https://app.staging.e-potek.ch
- https://admin.staging.e-potek.ch

## Client Sizes

Here we can keep track of bundle size changes over time.

| Date       | `www`  | `app`  | `admin` | `pro`  | Comment                                  |
| ---------- | ------ | ------ | ------- | ------ | ---------------------------------------- |
| 18/12/2018 | 3.27MB | 4.69MB | 4.77MB  | 3.81MB |                                          |
| 18/12/2018 |        | 4.04MB |         |        | Added `loadable` on all of `app`'s pages |
| 18/12/2018 |        |        |         | 3.67MB | Added `loadable` on all of `pro`'s pages |
| 18/04/2019 | 2.03MB | 2.46MB | 3.59MB  | 2.30MB | PR #456                                  |

Main things to optimize:

- [x] Antd icons: https://github.com/ant-design/ant-design/issues/12011
- [x] redux-form
- [x] Remove jquery: Required by `themeteorchef:bert`, `cultofcoders:persistent-session` and `meteortoys`, which can be ignored since it's dev-only
  - https://github.com/cult-of-coders/meteor-persistent-session/issues/2
- [ ] Material-ui initial load size
- [ ] Don't load all the meteor collection stuff on first load, but only when on a page that requires them
- [ ] Figure out why some components are being loaded, such as in `core/components/Financing`

## Troubleshooting tricks

Sometimes meteor won't start, or get stuck without printing the error it encountered (in tests for example).

To see what's wrong, follow these steps:

1. Create a file in lib/index.js or lib/index.test.js, because files in lib/ are loaded early
2. add an exception handler:
   1. `process.on('uncaughtException', console.log)`
3. Restart the app
