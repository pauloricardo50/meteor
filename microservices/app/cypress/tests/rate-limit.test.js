/* eslint-env mocha */
import {
  E2E_DEV_EMAIL,
  E2E_USER_EMAIL,
  USER_PASSWORD,
} from '../../imports/core/fixtures/fixtureConstants';

// FIXME: Rate-limiting has been disabled
describe.skip('Method rate limits', () => {
  before(() => {
    cy.initiateTest();
    // cy.callMethod('resetDatabase');
    // cy.callMethod('generateTestData');
  });

  beforeEach(() => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000); // Wait to reset TimeRange limit
    cy.meteorLogout();
  });

  describe('Method without set limit', () => {
    it('method should allow call 5 times', () => {
      for (let i = 0; i < 5; i += 1) {
        cy.callMethod('methodWithoutSetLimit').then((data) => {
          expect(data).equal(1);
        });
      }
    });

    it('method should not allow call 6 times as logged out', () => {
      for (let i = 0; i < 5; i += 1) {
        cy.callMethod('methodWithoutSetLimit').then((data) => {
          expect(data).equal(1);
        });
      }
      cy.callMethod('methodWithoutSetLimit').then(err =>
        expect(err.error).equal('too-many-requests'));
    });

    it('method should not allow call 6 times as user', () => {
      cy.meteorLogin(E2E_USER_EMAIL, USER_PASSWORD);
      for (let i = 0; i < 5; i += 1) {
        cy.callMethod('methodWithoutSetLimit').then((data) => {
          expect(data).equal(1);
        });
      }
      cy.callMethod('methodWithoutSetLimit').then(err =>
        expect(err.error).equal('too-many-requests'));
    });

    it('method should allow call 6 times as dev', () => {
      cy.meteorLogin(E2E_DEV_EMAIL, USER_PASSWORD);
      for (let i = 0; i < 6; i += 1) {
        cy.callMethod('methodWithoutSetLimit').then((data) => {
          expect(data).equal(1);
        });
      }
    });
  });

  describe('Method with default limit', () => {
    it('method should allow call 5 times', () => {
      for (let i = 0; i < 5; i += 1) {
        cy.callMethod('methodWithSetDefaultLimit').then((data) => {
          expect(data).equal(1);
        });
      }
    });

    it('method should not allow call 6 times as logged out', () => {
      for (let i = 0; i < 5; i += 1) {
        cy.callMethod('methodWithSetDefaultLimit').then((data) => {
          expect(data).equal(1);
        });
      }
      cy.callMethod('methodWithSetDefaultLimit').then(err =>
        expect(err.error).equal('too-many-requests'));
    });

    it('method should not allow call 6 times as user', () => {
      cy.meteorLogin(E2E_USER_EMAIL, USER_PASSWORD);
      for (let i = 0; i < 5; i += 1) {
        cy.callMethod('methodWithSetDefaultLimit').then((data) => {
          expect(data).equal(1);
        });
      }
      cy.callMethod('methodWithSetDefaultLimit').then(err =>
        expect(err.error).equal('too-many-requests'));
    });

    it('method should allow call 6 times as dev', () => {
      cy.meteorLogin(E2E_DEV_EMAIL, USER_PASSWORD);
      for (let i = 0; i < 6; i += 1) {
        cy.callMethod('methodWithSetDefaultLimit').then((data) => {
          expect(data).equal(1);
        });
      }
    });
  });

  describe('Method with set limit', () => {
    it('method should allow call 3 times as logged out', () => {
      for (let i = 0; i < 3; i += 1) {
        cy.callMethod('methodWithSetLimit').then((data) => {
          expect(data).equal(1);
        });
      }
    });

    it('method should not allow call 4 times as logged out', () => {
      for (let i = 0; i < 3; i += 1) {
        cy.callMethod('methodWithSetLimit').then((data) => {
          expect(data).equal(1);
        });
      }
      cy.callMethod('methodWithSetLimit').then(err =>
        expect(err.error).equal('too-many-requests'));
    });

    it('method should allow call 3 times as user', () => {
      cy.meteorLogin(E2E_USER_EMAIL, USER_PASSWORD);
      for (let i = 0; i < 3; i += 1) {
        cy.callMethod('methodWithSetLimit').then((data) => {
          expect(data).equal(1);
        });
      }
    });

    it('method should not allow call 4 times as user', () => {
      cy.meteorLogin(E2E_USER_EMAIL, USER_PASSWORD);
      for (let i = 0; i < 3; i += 1) {
        cy.callMethod('methodWithSetLimit').then((data) => {
          expect(data).equal(1);
        });
      }
      cy.callMethod('methodWithSetLimit').then(err =>
        expect(err.error).equal('too-many-requests'));
    });

    it('method should allow call 4 times as dev', () => {
      cy.meteorLogin(E2E_DEV_EMAIL, USER_PASSWORD);
      for (let i = 0; i < 4; i += 1) {
        cy.callMethod('methodWithSetLimit').then((data) => {
          expect(data).equal(1);
        });
      }
    });

    it('method should not allow call 5 times as dev', () => {
      cy.meteorLogin(E2E_DEV_EMAIL, USER_PASSWORD);
      for (let i = 0; i < 4; i += 1) {
        cy.callMethod('methodWithSetLimit').then((data) => {
          expect(data).equal(1);
        });
      }
      cy.callMethod('methodWithSetLimit').then(err =>
        expect(err.error).equal('too-many-requests'));
    });
  });
});
