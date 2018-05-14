import { USER_EMAIL, route } from '../../imports/core/cypress/testHelpers';
import capitalize from 'lodash/capitalize';

const pages = {
  public: {
    Login: route('/login', { shouldRender: 'section.login-page' }),
    'Reset Password': route('/reset-password/fakeToken', {
      shouldRender: '#password-reset-page',
    }),
    'Enroll Account': route('/enroll-account/fakeToken', {
      shouldRender: '#password-reset-page',
    }),
    'Impersonate (Valid Token)': ({ userId, adminLoginToken }) =>
      route(`/impersonate?userId=${userId}&authToken=${adminLoginToken}`, {
        shouldRender: '#impersonation-success-message',
      }),
  },

  user: {
    App: route('/', { shouldRender: '#app-page' }),
    Profile: route('/profile', { shouldRender: '#account-page' }),
    'Verify Email (Invalid Token)': route('/verify-email/invalidToken', {
      shouldRender: '#email-verification-page',
    }),
    'Verify Email (Valid Token)': ({ emailVerificationToken }) =>
      route(`/verify-email/${emailVerificationToken}`, {
        shouldRender: '#email-verification-page',
      }),
    Loan: ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}`, { shouldRender: '#dashboard-page' }),
    'Add Loan': ({ unownedLoan: { _id } }) =>
      route(`/add-loan/${_id}`, { shouldRender: '#add-loan-page' }),
    'Loan Files': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/files`, { shouldRender: '#files-page .files-tab' }),
    'Loan Property': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/property`, { shouldRender: '#property-page' }),
    'Loan Offerpicker': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/offerpicker`, { shouldRender: '#offerpicker-page' }),
    'Loan Verification': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/verification`, {
        shouldRender: '#verification-page',
      }),
    'Loan Structure': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/structure`, { shouldRender: '#structure-page' }),

    // TODO: 3 cases (if-else render) here... what should we do?
    'Loan Auction': ({ step3Loan: { _id } }) =>
      route(`/loans/${_id}/auction`, {
        shouldRender: 'section[class*=" auction-page-"]',
      }),
    //   'Loan Strategy': ({ step3Loan: { _id } }) => route(`/loans/${_id}/strategy`, { shouldRender: 'section.' }),
    //   'Loan Contract': ({ step3Loan: { _id } }) => route(`/loans/${_id}/contract`, { shouldRender: 'section.' }),
    //   'Loan Closing': ({ step3Loan: { _id } }) => route(`/loans/${_id}/closing`, { shouldRender: 'section.' }),
    //   'Loan Finance': ({ step3Loan: { _id } }) => route(`/loans/${_id}/finance`, { shouldRender: 'section.' }),
    //   'Borrower Personal': ({ step3Loan: { _id, borrowers } }) =>
    //     route(`/loans/${_id}/borrowers/${borrowers[0]._id}/personal`, { shouldRender: 'section.' }),
    //   'Borrower Finance': ({ step3Loan: { _id, borrowers } }) =>
    //     route(`/loans/${_id}/borrowers/${borrowers[0]._id}/finance`, { shouldRender: 'section.' }),
    //   'Borrower Files': ({ step3Loan: { _id, borrowers } }) =>
    //     route(`/loans/${_id}/borrowers/${borrowers[0]._id}/files`, { shouldRender: 'section.' }),
    'Not Found': route('/a-page-that-does-not-exist', {
      shouldRender: '#not-found-page',
    }),
  },

  dev: {
    Dev: route('/dev', { shouldRender: '#dev-page' }),
  },
};

let testData;

describe('App Pages', () => {
  before(() => {
    cy.visit('/');

    cy
      .eraseAndGenerateTestData()
      .getTestData(USER_EMAIL)
      .then((data) => {
        testData = data;
      });
  });

  Object.keys(pages).forEach((pageAuthentication) => {
    describe(`${capitalize(pageAuthentication)} Pages`, () => {
      Object.keys(pages[pageAuthentication]).forEach((pageName) => {
        describe(`${pageName} Page`, () => {
          it('should render', () => {
            // logout the impersonated user
            const { IMPERSONATE_SESSION_KEY } = testData;
            cy
              .window()
              .then(({ Session }) => Session.clear(IMPERSONATE_SESSION_KEY));

            if (pageAuthentication === 'public') {
              cy.meteorLogout();
            } else {
              cy.meteorLogoutAndLogin(`${pageAuthentication}-1@e-potek.ch`);
            }

            const pageRoute =
              typeof pages[pageAuthentication][pageName] === 'function'
                ? pages[pageAuthentication][pageName](testData)
                : pages[pageAuthentication][pageName];

            const {
              uri,
              options: {
                shouldRender: expectedDomElement,
                shouldContain: expectedString,
              },
            } = pageRoute;

            cy
              .window()
              .then(({ reactRouterDomHistory }) => {
                reactRouterDomHistory.push(uri);
              })
              .routeShouldExist(uri)
              .get(expectedDomElement)
              .should('exist');
          });
        });
      });
    });
  });
});
