/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { getMountedComponent, stubCollections } from 'core/utils/testHelpers';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';

// User pages
import AccountPage from '../AccountPage';
import AuctionPage from '../AuctionPage';
import BorrowerPage from '../BorrowerPage';
import DashboardPage from '../DashboardPage';
import ContractPage from '../ContractPage';
import ClosingPage from '../ClosingPage';
import OfferPickerPage from '../OfferPickerPage';
import PropertyPage from '../PropertyPage';
import StructurePage from '../StructurePage';
import VerificationPage from '../VerificationPage';
import FinancePage from '../FinancePage';
import ComparePage from '../ComparePage';
import AppPage from '../AppPage';

const pages = {
  AccountPage,
  AuctionPage,
  BorrowerPage,
  DashboardPage,
  ContractPage,
  ClosingPage,
  OfferPickerPage,
  PropertyPage,
  StructurePage,
  VerificationPage,
  ComparePage,
  AppPage,
  FinancePage,
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
