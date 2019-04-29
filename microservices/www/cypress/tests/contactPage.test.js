/* eslint-env mocha */
import { expect } from 'chai';

const email = 'digital@e-potek.ch';
const assertEmails = () => {
  cy.callMethod('getAllTestEmails', { expected: 2 }).then((emails) => {
    expect(emails.length).to.equal(2);

    const contactEmail = emails.find(({ emailId }) => emailId === 'CONTACT_US');
    expect(contactEmail.address).to.equal(email);

    const contactAdminEmail = emails.find(({ emailId }) => emailId === 'CONTACT_US_ADMIN');
    expect(contactAdminEmail.address).to.equal('dev@e-potek.ch');
  });
};

describe('ContactPage', () => {
  before(() => {
    cy.initiateTest();
  });

  beforeEach(() => {
    cy.callMethod('resetDatabase');
  });

  it('sends a contact message without details', () => {
    cy.visit('/contact');
    cy.contains('dans la boite').should('not.exist');

    cy.get('input[name=name]').type('John');
    cy.get('input[name=email]').type(email);
    cy.get('input[name=phoneNumber]').type('022 566 01 10{enter}');

    cy.contains('dans la boite').should('exist');

    assertEmails();
  });

  it('sends a contact message with details', () => {
    cy.visit('/contact');
    cy.contains('dans la boite').should('not.exist');

    cy.get('input[name=name]').type('John');
    cy.get('input[name=email]').type(email);
    cy.get('input[name=phoneNumber]').type('022 566 01 10');
    cy.get('textarea[name=details]').type('It works!{enter}On multiple lines!');
    cy.contains('Continuer').click();

    cy.contains('dans la boite').should('exist');

    assertEmails();
  });
});
