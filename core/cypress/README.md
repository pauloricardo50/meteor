# Cypress Short "How To"

## Running Cypress end-to-end tests

Cypress is basically a browser test runner. You can run the end to end tests locally with:

```bash
meteor npm run test-e2e
```

and on CI with:

```bash
meteor npm run test-e2e-CI
```

Note that the Cypress npm module is installed only once, in `core`, and used by all microservices.

## Files Structure

* the `core/cypress` directory contains the commonly used Cypress resources.
* `<microservice>/cypress.json` configures Cypress for that specific microservice
* the `<microservice>/cypress` directory contains Cypress files specific for that microservice
  * `<microservice>/cypress/tests` contains the test files
  * `<microservice>/cypress/server/methods.js` contains a Meteor method made available ONLY when the end-to-end test server is running by using an environment variable passed from `package.json`. For Security reasons, you must always make test methods available ONLY for the test end-to-end server and not for the regular server.
  * `<microservice>/cypress/support/commands` contains custom Cypress commands you can add and use in all microservices.

## Automatically generated tests

Looking into `<microservice>-pages.test.js`, you'll see an object from which tests are automatically generated. Those tests ensure that those routes succesfully render and you can easily add another one. The route can be a string or a function which receives that test data retrieved from a Meteor method in `<microservice>/cypress/server/methods.js`.

## Testing

### Writing tests

You got the `cy` object used to visit a page (`cy.visit('/some-route')`), query (with CSS selectors) & assert agains some element on the page (`cy.get('h1.second-header').should('contain', 'Some Text')`), use commands defined by you (`cy.fillInvoiceForm()`) and more. Checkout the docs: https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html#.

When you expect something to be (or not to be) on the page with `cy.get`, Cypress waits a certain time for the element you assert agains to pass the assertion, making this a convenient way to test if for example: something hasn't yet loaded on the page or you have to wait for some animation to finish before your element is available, etc.

### Promise-like behaviour

Cypress commands and your custom Cypress commands are promise-like, as Cypress named them; however, they are not really promises. You can chain them or put them one after the other and Cypress will wait for the first to complete and then perform the next, and so on. Furthermore, in some situations as in this repo, we need to use `Cypress.Promise` to wrap some asynchronous javascript functions with promises so that we know when they finished and return their callback results. You can find examples in the `commands.js` file.

### Commands

Commands are very useful: they help you create reusable test code. For example you can put the UI actions needed to fill a form in a command and use that command in all microservices!
