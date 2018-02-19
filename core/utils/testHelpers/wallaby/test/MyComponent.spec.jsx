/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';
import { Meteor } from 'meteor/meteor';

import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  const wrapper = props => shallow(<MyComponent />);

  it('renders', () => {
    expect(wrapper().exists()).to.equal(true);
    expect(Meteor.userId()).to.equal('userId');
  });
});
