/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {
  getMountedComponent,
  stubCollections,
  generateData,
} from 'core/utils/testHelpers';
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
  describe('Admin Pages basic render', () => {
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
        const component = () =>
          getMountedComponent({
            Component: page,
            props,
            withRouter: true,
            withStore: true,
          });

        beforeEach(() => {
          getMountedComponent.reset();
          const data = generateData({ user: { roles: 'dev' } });

          props = {
            ...data,
            currentUser: data.user,
            location: {},
            history: {},
            match: {
              params: {
                borrowerId: data.borrowers[0]._id,
                requestId: data.loanRequest._id,
              },
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
