import { STEPS } from '../../imports/core/api/loans/loanConstants';
/* eslint-env mocha */
import { ROLES } from '../../imports/core/api/users/userConstants';
import {
  ADMIN_EMAIL,
  DEV_EMAIL,
  USER_PASSWORD,
} from '../../imports/core/cypress/server/e2eConstants';
import { generateTestsForPages, route } from '../../imports/core/cypress/utils';
import { E2E_USER_EMAIL } from '../../imports/core/fixtures/fixtureConstants';

const pages = {
  public: {
    Login: route('/login', { shouldRender: 'section.login-page' }),

    'Reset Password': ({ passwordResetToken }) =>
      route(`/reset-password/${passwordResetToken}`, {
        shouldRender: '#password-reset-page',
      }),

    'Verify Email (Valid Token)': ({ emailVerificationToken }) =>
      route(`/verify-email/${emailVerificationToken}`, {
        shouldRender: '#email-verification-page',
      }),
  },

  user: {
    App: route('/', { shouldRender: '#app-page' }),

    Account: route('/account', { shouldRender: '#AccountPage' }),

    Dashboard: route(`/loans/loanId`, { shouldRender: '#DashboardPage' }),

    'Loan Files': route(`/loans/loanId/files`, {
      shouldRender: '#FilesPage .files-tab',
    }),

    'Loan Single Property': route(`/loans/loanId/properties/propertyId`, {
      shouldRender: '#SinglePropertyPage',
    }),

    'Borrower Personal': route(`/loans/loanId/borrowers/personal`, {
      shouldRender: '.borrower-page-info',
    }),

    'Borrower Finance': route(`/loans/loanId/borrowers/finance`, {
      shouldRender: '.borrower-finance-page',
    }),

    'Not Found': route('/a-page-that-does-not-exist', {
      shouldRender: '#not-found-page',
    }),
  },

  dev: {
    Dev: route('/dev', { shouldRender: '#dev-page' }),
  },
};

describe('App Pages', () => {
  let testData;

  before(() => {
    cy.startTest();
    cy.meteorLogout();
    cy.routeTo('/');
    cy.callMethod('resetDatabase');
    cy.callMethod('generateScenario', {
      scenario: {
        users: [
          {
            _id: 'user1',
            emails: [{ address: E2E_USER_EMAIL, verified: true }],
            loans: [
              {
                _id: 'loanId',
                properties: { _id: 'propertyId' },
                borrowers: {},
                displayWelcomeScreen: false,
                step: STEPS.REQUEST,
              },
              {},
            ],
          },
          {
            _id: 'dev1',
            _factory: ROLES.DEV,
            emails: [{ address: DEV_EMAIL, verified: true }],
          },
          {
            _id: 'advisor1',
            _factory: ROLES.ADVISOR,
            emails: [{ address: ADMIN_EMAIL, verified: true }],
          },
        ],
      },
    });
    cy.callMethod('setPassword', { userId: 'user1', password: USER_PASSWORD });
    cy.callMethod('setPassword', { userId: 'dev1', password: USER_PASSWORD });
    cy.callMethod('getAppEndToEndTestData').then(data => {
      testData = data;
    });
  });

  generateTestsForPages(pages, () => testData);
});
