/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';
import Link from 'core/components/Link';

import { STEPS } from 'core/api/constants';
import BorrowersSummary from 'core/components/BorrowersSummary';
import LoanSummary from '../LoanSummary';
import LoanSummaryColumns from '../LoanSummaryColumns';

const createdAt = new Date();
const updatedAt = new Date();
const loan = {
  _id: 'id',
  name: 'loanName',
  logic: { step: STEPS.PREPARATION },
  createdAt,
  updatedAt,
  borrowers: [],
  property: { value: 100000 },
};

describe('LoanSummary />', () => {
  it('renders a Link with the correct address', () => {
    const props = { loan };

    const wrapper = shallow(<LoanSummary {...props} />);

    const loanSummaryTitleLink = wrapper.find(Link).first();

    expect(loanSummaryTitleLink.prop('to')).to.equal(`/loans/${loan._id}`);
  });

  it('renders LoanSummaryColumns with correct props', () => {
    const props = { loan };

    const wrapper = shallow(<LoanSummary {...props} />);

    const loanSummaryColumns = wrapper.find(LoanSummaryColumns).first();

    expect(loanSummaryColumns.prop('loan')).to.deep.equal(loan);
  });

  it('renders BorrowersSummary with correct props', () => {
    const props = { loan };
    const { borrowers } = loan;

    const wrapper = shallow(<LoanSummary {...props} />);

    const borrowersSummary = wrapper.find(BorrowersSummary).first();

    expect(borrowersSummary.prop('borrowers')).to.deep.equal(borrowers);
  });
});
