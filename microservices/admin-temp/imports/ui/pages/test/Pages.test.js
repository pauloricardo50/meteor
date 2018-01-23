/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { getMountedComponent, stubCollections } from 'core/utils/testHelpers';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';

// Admin pages
import AdminDashboardPage from '../AdminDashboardPage';
import AdminDevPage from '../AdminDevPage';
import ContactLendersPage from '../ContactLendersPage';
import OfferPage from '../OfferPage';
import RequestsPage from '../RequestsPage';
import SingleRequestPage from '../SingleRequestPage';
import SingleUserPage from '../SingleUserPage';
import UsersPage from '../UsersPage';
import VerifyPage from '../VerifyPage';

const pages = {
  AdminDashboardPage,
  AdminDevPage,
  ContactLendersPage,
  OfferPage,
  RequestsPage,
  SingleRequestPage,
  SingleUserPage,
  UsersPage,
  VerifyPage,
};

if (Meteor.isClient) {
  describe('Pages basic render', () => {
    beforeEach(() => {
      resetDatabase();
      stubCollections();
    });

    afterEach(() => {
      stubCollections.restore();
    });

    Object.keys(pages).forEach((key) => {
      const page = pages[key];
      describe(`${key}`, () => {
        let props;
        const component = () => getMountedComponent(page, props, true);

        beforeEach(() => {
          getMountedComponent.reset();
          const user = Factory.create('dev');
          const userId = user._id;
          const borrower = Factory.create('borrower', { userId });
          const request = Factory.create('loanRequest', {
            userId,
            borrowers: [borrower],
          });

          props = {
            loanRequest: request,
            borrowers: [borrower],
            currentUser: user,
            user,
            offers: [],
            location: {},
            history: {},
            match: {
              params: { borrowerId: borrower._id, requestId: request._id },
            },
          };
        });

        it('Renders correctly', () => {
          const sections = component().find('section');

          expect(sections.length).to.be.at.least(1);
        });
      });
    });
  });
}
