/* eslint-env mocha */
import { E2E_DEV_EMAIL, USER_PASSWORD } from '../../imports/core/fixtures/fixtureConstants';

describe('Method rate limits', () => {
  before(() => {
    cy.callMethod('resetDatabase');
    cy.callMethod('generateTestData');
  });

  beforeEach(() => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000); // Wait to reset TimeRange limit
  });

  describe('Method without limit', () => {
    it('method should allow call multiple times', () => {
      for (let i = 0; i < 10; i += 1) {
        cy.callMethod('methodWitoutLimit').then((data) => {
          expect(data).equal(1);
        });
      }
    });
  });

  describe('Method with default limit', () => {
    it('method should allow call 5 times', () => {
      for (let i = 0; i < 5; i += 1) {
        cy.callMethod('methodWithDefaultLimit').then((data) => {
          expect(data).equal(1);
        });
      }
    });

    it('method should not allow call 6 times', () => {
      for (let i = 0; i < 5; i += 1) {
        cy.callMethod('methodWithDefaultLimit').then((data) => {
          expect(data).equal(1);
        });
      }
      cy.callMethod('methodWithDefaultLimit').then(err => expect(err.error).equal('too-many-requests'));
    });
  });

  describe('Method with limit', () => {
    it('method should allow call 3 times as logged out', () => {
      for (let i = 0; i < 3; i += 1) {
        cy.callMethod('methodWithtLimit').then((data) => {
          expect(data).equal(1);
        });
      }
    });

    it('method should not allow call 4 times as logged out', () => {
      for (let i = 0; i < 3; i += 1) {
        cy.callMethod('methodWithtLimit').then((data) => {
          expect(data).equal(1);
        });
      }
      cy.callMethod('methodWithtLimit').then(err => expect(err.error).equal('too-many-requests'));
    });

    it('method should allow call 4 times as dev', () => {
      cy.meteorLogin(E2E_DEV_EMAIL, USER_PASSWORD);
      for (let i = 0; i < 4; i += 1) {
        cy.callMethod('methodWithtLimit').then((data) => {
          expect(data).equal(1);
        });
      }
    });

    it('method should not allow call 5 times as dev', () => {
      cy.meteorLogin(E2E_DEV_EMAIL, USER_PASSWORD);
      for (let i = 0; i < 4; i += 1) {
        cy.callMethod('methodWithtLimit').then((data) => {
          expect(data).equal(1);
        });
      }
      cy.callMethod('methodWithtLimit').then(err => expect(err.error).equal('too-many-requests'));
    });
  });
});
