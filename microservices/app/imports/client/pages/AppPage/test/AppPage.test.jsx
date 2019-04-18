/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';
import { Redirect } from 'react-router-dom';

import AppPage from '../AppPage';

describe('AppPage', () => {
  let props;
  const component = () => shallow(<AppPage {...props} />);

  beforeEach(() => {
    props = { currentUser: { emails: [{}], loans: [] } };
  });

  it('renders some text if no loan is passed', () => {
    expect(component().find('p').length).to.equal(1);
    expect(component()
      .find('p')
      .first()
      .children()
      .text()).to.equal('<T />');
  });

  it('redirects to the loan if only one loan exists', () => {
    const id = 'testId';
    props.currentUser.loans = [{ _id: id }];
    expect(component().find(Redirect).length).to.equal(1);
    expect(component()
      .find(Redirect)
      .first()
      .props().to).to.equal(`/loans/${id}`);
  });
});
