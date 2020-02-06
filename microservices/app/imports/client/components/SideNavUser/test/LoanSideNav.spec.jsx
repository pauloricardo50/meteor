//
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';
import { NavLink } from 'react-router-dom';

import { LoanSideNav } from '../LoanSideNav';

describe('LoanSideNav', () => {
  let props;
  const component = () => shallow(<LoanSideNav {...props} />);

  beforeEach(() => {
    props = {
      links: [],
      loan: {
        _id: 'testId',
        borrowers: [{ _id: 'testBorrower' }],
        properties: [{ _id: '' }],
      },
    };
  });

  it('renders one navlink', () => {
    props.links[0] = { id: 'test', to: '/path/to/:loanId' };
    expect(component().find(NavLink).length).to.equal(1);
  });

  it('replaces the path with the right ids', () => {
    props.links[0] = { id: 'test', to: '/path/to/:loanId' };
    expect(
      component()
        .find(NavLink)
        .first()
        .props().to,
    ).to.equal(`/path/to/${props.loan._id}`);
  });

  it('passes any extra props on a link to the NavLink', () => {
    props.links[0] = { id: 'test', to: '/path/to/:loanId', someProp: 'yo' };
    expect(
      component()
        .find(NavLink)
        .first()
        .props().someProp,
    ).to.equal('yo');
  });
});
