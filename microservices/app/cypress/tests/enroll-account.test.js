/* eslint-env mocha */
import { expect } from 'chai';

let userId;
const token = '';

describe.skip('Enroll account flow', () => {
  before(() => {
    cy.setAuthentication('dev')
      .then(() =>
        cy.window(({ Meteor }) =>
          new Cypress.Promise((resolve, reject) => {
            Meteor.call(
              'adminCreateUser',
              { options: {}, role: 'USER' },
              (err, userId) => (err ? reject(err) : resolve(userId)),
            );
          })))
      .then((result) => {
        console.log('userId', result);
        userId = result;
      });
  });
  it('test name', () => {
    cy.visit(`/enroll-account/${token}`);
  });
});
