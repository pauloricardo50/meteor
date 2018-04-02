import { expect } from 'chai';

const defaultUserEmail = 'user-1@epotek.ch';
const defaultUserPassword = '12345';

Cypress.Commands.add('meteorLogout', () => {
  cy.visit('/', {
    onLoad: ({ Meteor }) =>
      new Promise((resolve) => {
        Meteor.logout(() => resolve());
      }),
  });
});

Cypress.Commands.add('meteorLogin', () => {
  cy.meteorLogout().then(({ Meteor }) =>
    new Promise((resolve, reject) => {
      Meteor.loginWithPassword(
        defaultUserEmail,
        defaultUserPassword,
        err => (err ? reject() : resolve()),
      );
    }));
});

// wait for the loader until it closes and then do further
Cypress.Commands.add('waitUntilLoads', () => {
  const isLoading = Cypress.$('.loading-container')[0];
  if (isLoading) {
    cy.get('.loading-container').should('not.exist');
  }
});

Cypress.Commands.add('shouldRenderWithoutErrors', () => {
  cy.get('section').should('be.ok');
});
