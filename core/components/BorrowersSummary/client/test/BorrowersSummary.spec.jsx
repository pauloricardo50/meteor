/* eslint-env mocha */
import React from 'react';
import Chip from '@material-ui/core/Chip';
import { expect } from 'chai';

import { shallow } from '../../../../utils/testHelpers';
import T from '../../../Translation';
import BorrowersSummary from '../../BorrowersSummary';

describe('BorrowersSummary />', () => {
  const borrowers = [
    {
      _id: 'firstBorrowerId',
      firstName: 'John',
      lastName: 'Doe',
    },
    {
      _id: 'secondBorrowerId',
      firstName: 'John',
      lastName: 'Doe2',
    },
  ];

  it('renders the correct number of Chips with correct props', () => {
    const expectedNbOfBorrowers = borrowers.length;
    const expectedFirstBorrowerLabel = (
      <T id="BorrowersSummary.borrower" values={{ index: 1 }} />
    );
    const props = { borrowers };
    const wrapper = shallow(<BorrowersSummary {...props} />);
    const chipsArray = wrapper.find(Chip);

    expect(chipsArray).to.have.length(expectedNbOfBorrowers);

    expect(chipsArray.first().prop('label').props).to.deep.equal(
      expectedFirstBorrowerLabel.props,
    );
  });

  it('displays just the corresponding message when there are no borrowers', () => {
    const props = { borrowers: [] };
    const wrapper = shallow(<BorrowersSummary {...props} />);

    expect(wrapper.find('.borrowers-list').children()).to.have.length(1);
    expect(
      wrapper
        .find('.borrowers-list')
        .children()
        .find(T)
        .prop('id'),
    ).to.equal('general.noBorrowersForLoan');
  });
});
