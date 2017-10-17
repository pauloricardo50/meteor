/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {
  getMountedComponent,
  stubCollections,
} from '/imports/js/helpers/testHelpers';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';

// User pages
import AccountPage from '../user/AccountPage';
import AuctionPage from '../user/AuctionPage';
import BorrowerPage from '../user/BorrowerPage';
import DashboardPage from '../user/DashboardPage';
import ContractPage from '../user/ContractPage';
import ClosingPage from '../user/ClosingPage';
import OfferPickerPage from '../user/OfferPickerPage';
import PropertyPage from '../user/PropertyPage';
import StructurePage from '../user/StructurePage';
import VerificationPage from '../user/VerificationPage';
import FinancePage from '../user/FinancePage';
import ComparePage from '../user/ComparePage';
import AppPage from '../user/AppPage';

// Admin pages
import AdminDashboardPage from '../admin/AdminDashboardPage';
import AdminDevPage from '../admin/AdminDevPage';
import ContactLendersPage from '../admin/ContactLendersPage';
import OfferPage from '../admin/OfferPage';
import RequestsPage from '../admin/RequestsPage';
import SingleRequestPage from '../admin/SingleRequestPage';
import SingleUserPage from '../admin/SingleUserPage';
import UsersPage from '../admin/UsersPage';
import VerifyPage from '../admin/VerifyPage';

import PartnerHomePage from '../partner/PartnerHomePage';
import PartnerRequestPage from '../partner/PartnerRequestPage';

const pages = {
  AccountPage,
  AuctionPage,
  // BorrowerPage,
  DashboardPage,
  ContractPage,
  ClosingPage,
  OfferPickerPage,
  // PropertyPage,
  StructurePage,
  VerificationPage,
  ComparePage,

  AdminDashboardPage,
  AdminDevPage,
  ContactLendersPage,
  OfferPage,
  RequestsPage,
  // SingleRequestPage,
  SingleUserPage,
  UsersPage,
  VerifyPage,

  PartnerHomePage,
  PartnerRequestPage,
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
          const request = Factory.create('loanRequest');
          const borrower = Factory.create('borrower');
          const user = Factory.create('dev');
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
