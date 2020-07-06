# meteortesting:mocha-core

This is an internal package. Please use [`meteortesting:mocha`](https://github.com/meteortesting/meteor-mocha)

## In-/Decrease default test timeout

In case you want to in- or decrease the default timeout of 2000 ms, you can set the environment variable `MOCHA_TIMEOUT` in your shell which will be picked up by this library and passed on to the mocha instance.

## Mocha configuration with .mocharc file
<!-- Please keep this section in sync with meteortesting:mocha package -->

You can configure the mocha runner with a `.mocharc.js` or a `.mocharc.json` file at the root of your meteor app. You can find examples of config files [here](https://github.com/mochajs/mocha/tree/master/example/config).

Please keep in mind that all options might not be compatible with how the Meteor test runner operates.

### Example

Feel free to start with this file as an example:

```js
module.exports = {
  forbidOnly: process.env.IS_CI, // You could set this variable inside your continuous integration platform
  retries: 2,
  slow: 200,
  timeout: 10000,
};
```