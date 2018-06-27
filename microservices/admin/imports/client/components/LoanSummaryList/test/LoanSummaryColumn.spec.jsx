/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import T from 'core/components/Translation';
import LoanSummaryColumn from '../LoanSummaryColumn';

describe('LoanSummaryColumn />', () => {
  const props = {
    translationId: 'translationId',
    content: 'content',
  };

  it('renders a Translation component with correct props', () => {
    const wrapper = shallow(<LoanSummaryColumn {...props} />);

    expect(wrapper
      .find('label')
      .first()
      .find(T)
      .first()
      .prop('id')).to.deep.equal(props.translationId);
  });

  it('displays the correct content', () => {
    const wrapper = shallow(<LoanSummaryColumn {...props} />);

    expect(wrapper
      .find('p')
      .first()
      .text()).to.deep.equal(props.content);
  });
});
