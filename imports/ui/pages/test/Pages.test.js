import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'meteor/practicalmeteor:mocha';
import getMountedComponent from '/imports/js/helpers/testHelpers';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';

// User pages
import AccountPage from '../user/AccountPage.jsx';
import AuctionPage from '../user/AuctionPage.jsx';
import BorrowerPage from '../user/BorrowerPage.jsx';
import ContactPage from '../user/ContactPage.jsx';
import DashboardPage from '../user/DashboardPage.jsx';
import ExpertisePage from '../user/ExpertisePage.jsx';
import FinalStepsPage from '../user/FinalStepsPage.jsx';
import LenderPickerPage from '../user/LenderPickerPage.jsx';
import NewPage from '../user/NewPage.jsx';
import NewRequestPage from '../user/NewRequestPage.jsx';
import PropertyPage from '../user/PropertyPage.jsx';
import StructurePage from '../user/StructurePage.jsx';
import VerificationPage from '../user/VerificationPage.jsx';

// Admin pages
import AdminDashboardPage from '../admin/AdminDashboardPage.jsx';
import AdminDevPage from '../admin/AdminDevPage.jsx';
import ContactLendersPage from '../admin/ContactLendersPage.jsx';
import OfferPage from '../admin/OfferPage.jsx';
import RequestsPage from '../admin/RequestsPage.jsx';
import SingleRequestPage from '../admin/SingleRequestPage.jsx';
import SingleUserPage from '../admin/SingleUserPage.jsx';
import UsersPage from '../admin/UsersPage.jsx';
import VerifyPage from '../admin/VerifyPage.jsx';

import PartnerHomePage from '../partner/PartnerHomePage.jsx';
import PartnerRequestPage from '../partner/PartnerRequestPage.jsx';

const pages = {
  AccountPage,
  AuctionPage,
  BorrowerPage,
  ContactPage,
  DashboardPage,
  ExpertisePage,
  FinalStepsPage,
  LenderPickerPage,
  NewPage,
  NewRequestPage,
  PropertyPage,
  StructurePage,
  VerificationPage,

  AdminDashboardPage,
  AdminDevPage,
  ContactLendersPage,
  OfferPage,
  RequestsPage,
  SingleRequestPage,
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
    });

    Object.keys(pages).forEach(key => {
      const page = pages[key];
      describe(`${key}`, () => {
        let props;
        const component = () => getMountedComponent(page, props, true);

        beforeEach(() => {
          const request = Factory.create('loanRequest');
          const borrower = Factory.create('borrower');
          const user = Factory.create('dev');
          props = {
            loanRequest: request,
            borrowers: [borrower],
            currentUser: user,
            location: {},
            match: { params: { borrowerId: borrower._id, requestId: request._id } },
          };
          getMountedComponent.reset();
        });

        it('Renders correctly', () => {
          const sections = component().find('section');

          expect(sections.length).to.be.at.least(1);
        });
      });
    });
  });
}
