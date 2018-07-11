/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import { dive } from 'enzyme';

import InterestRatesTable from 'core/components/InterestRatesTable';
import { shallow, mount } from 'core/utils/testHelpers/enzyme';
import { getMountedComponent } from 'core/utils/testHelpers';
import generalInterestRates from 'core/components/InterestRatesTable/interestRates';
import { AUCTION_STATUS } from 'core/api/constants';

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
const component = props => shallow(<LoanInterestRatesTable {...props} />);
// const component = props => mount(<LoanInterestRatesTable {...props} />);

describe('LoanInterestRatesTable', () => {
  const loan = Factory.create('loan');
  const firstOffer = Factory.create('offer', { loanId: loan._id });
  const secondOffer = Factory.create('offer', { loanId: loan._id });
  const offers = [firstOffer, secondOffer];
  const propsWithOffersRates = {
    columnOptions,
    rows: rows({ interestRates: getInterestRatesFromOffers({ offers }) }),
  };

  // beforeEach(() => getMountedComponent.reset());

  it('renders a `InterestRatesTable` component with rates from offers when the auction has ended', () => {
    loan.logic = { auction: { status: AUCTION_STATUS.ENDED } };

    // expect(component({ loanId: loan._id, hasAuctionEnded: true })
    //   .find(InterestRatesTable)
    //   .props()).to.deep.equal(propsWithOffersRates );
  });

  it('renders a `InterestRatesTable` component with general rates while the auction  is ongoing', () => {
    loan.logic = { auction: { status: AUCTION_STATUS.NONE } };

    // expect(component({ loanId: loan._id, hasAuctionEnded: false })
    //   .find(InterestRatesTable)
    //   .props()).to.deep.equal(propsWithDefaultRates);
  });
});
