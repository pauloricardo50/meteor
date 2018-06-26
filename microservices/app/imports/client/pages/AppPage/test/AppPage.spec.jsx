/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import AppPage from '../AppPage';

describe('AppPage', () => {
  let props;
  const component = () => shallow(<AppPage {...props} />);

  beforeEach(() => {
    props = { loans: [] };
  });

  it('renders some text if no loan is passed', () => {
    expect(component().find('p')).to.equal(1);
  });
});
