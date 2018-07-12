/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import SearchResults from '../SearchResults';

describe('SearchResults', () => {
  let props;
  const component = () => shallow(<SearchResults {...props} />);

  beforeEach(() => {
    props = {};
  });

  it('This component is a pain to test', () => {
    // Please refactor me
  });
});
