/* eslint-env mocha */
import { expect } from 'chai';
import { Factory } from 'meteor/dburles:factory';

import generalInterestRates from 'core/components/InterestRatesTable/interestRates';
import InterestRatesTable from 'core/components/InterestRatesTable';
import { AUCTION_STATUS } from 'core/api/constants';
import { getMountedComponent } from 'core/utils/testHelpers';
import pollUntilReady from 'core/utils/testHelpers/pollUntilReady';
import LoanInterestRatesTable from '../DashboardInfoInterestsTable';
import {
  columnOptions,
  rows,
  getInterestRatesFromOffers,
} from '../dashboardInfoInterestsHelpers';

const propsWithDefaultRates = {
  columnOptions,
  rows: rows({ interestRates: generalInterestRates }),
};

const component = props =>
  getMountedComponent({
    Component: LoanInterestRatesTable,
    props,
  });

const checkDataIsReady = comp =>
  pollUntilReady(() => {
    comp.update();
    return comp.find(InterestRatesTable).length > 0;
  });

describe.skip('DashboardInfoInterestRatesTable', () => {
  let loan;
  let loanId;
  let firstOffer;
  let secondOffer;
  let offers;
  let propsWithOffersRates;

  beforeEach(() => {
    getMountedComponent.reset();

    loan = Factory.create('loan', {
      logic: { auction: { status: AUCTION_STATUS.ENDED } },
    });
    loanId = loan._id;
    firstOffer = Factory.create('offer', { loanId });
    secondOffer = Factory.create('offer', { loanId });
    offers = [firstOffer, secondOffer];
    propsWithOffersRates = {
      columnOptions,
      rows: rows({ interestRates: getInterestRatesFromOffers(offers) }),
    };
  });
});
