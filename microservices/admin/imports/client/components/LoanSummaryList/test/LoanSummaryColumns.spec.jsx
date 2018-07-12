/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import { getLoanSummaryColumns } from '../loanSummaryHelpers';
import LoanSummaryColumns from '../LoanSummaryColumns';
import LoanSummaryColumn from '../LoanSummaryColumn';

const createdAt = new Date();
const updatedAt = new Date();
const loan = {
  _id: 'id',
  name: 'loanName',
  logic: { step: 10 },
  general: { fortuneUsed: 25000, insuranceFortuneUsed: 20000 },
  createdAt,
  updatedAt,
  borrowers: [],
  property: { value: 100000 },
};

describe('LoanSummaryColumns />', () => {
  const loanSummaryColumnsDetails = getLoanSummaryColumns(loan);

  it('renders the correct number of LoanSummaryColumn with correct props', () => {
    const props = { loan };
    const expectedNbOfColumns = loanSummaryColumnsDetails.length;

    const wrapper = shallow(<LoanSummaryColumns {...props} />);

    const loanSummaryColumnsArray = wrapper.find(LoanSummaryColumn);
    const firstLoanSummaryColumn = wrapper.find(LoanSummaryColumn).first();

    expect(loanSummaryColumnsArray).to.have.length(expectedNbOfColumns);
    expect(firstLoanSummaryColumn.prop('translationId')).to.equal(loanSummaryColumnsDetails[0].translationId);
    expect(firstLoanSummaryColumn.prop('content')).to.equal(loanSummaryColumnsDetails[0].content);
  });
});
