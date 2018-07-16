/* eslint-env mocha */
import { expect } from 'chai';
import { Factory } from 'meteor/dburles:factory';

import generalInterestRates from 'core/components/InterestRatesTable/interestRates';
import InterestRatesTable from 'core/components/InterestRatesTable';
import { AUCTION_STATUS } from 'core/api/constants';
import { getMountedComponent } from 'core/utils/testHelpers';
import pollUntilReady from 'core/utils/testHelpers/pollUntilReady';
import LoanInterestRatesTable from '../LoanInterestRatesTable';
import {
  columnOptions,
  rows,
  getInterestRatesFromOffers,
} from '../loanInterestsTableHelpers';

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

describe('LoanInterestRatesTable', () => {
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
      rows: rows({ interestRates: getInterestRatesFromOffers({ offers }) }),
    };
  });

  it('renders a `InterestRatesTable` component with rates from offers when the auction has ended', () => {
    const props = { loanId, hasAuctionEnded: true };

    return checkDataIsReady(component(props)).then(() => {
      expect(component()
        .find(InterestRatesTable)
        .props()).to.deep.include(propsWithOffersRates);
    });
  });

  // it('renders a `InterestRatesTable` component with general rates while the auction  is ongoing', () => {
  //   loan.logic = { auction: { status: AUCTION_STATUS.NONE } };

  //   expect(component({ loanId: loan._id, hasAuctionEnded: false })
  //     .find(InterestRatesTable)
  //     .props()).to.deep.equal(propsWithDefaultRates);
  // });
});
