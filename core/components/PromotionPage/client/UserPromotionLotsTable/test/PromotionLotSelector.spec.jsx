// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'core/utils/testHelpers/enzyme';

import PromotionLotSelector from '../PromotionLotSelector';
// import Checkbox from ''

describe('PromotionLotSelector', () => {
  let props;
  const component = () => mount(<PromotionLotSelector {...props} />);

  beforeEach(() => {
    props = {};
  });

  it('value is true if promotionOption exists', () => {
    props.promotionLotId = 'a';
    props.promotionOptions = [{ promotionLots: [{ _id: 'a' }] }];

    expect(component()
      .find('Checkbox')
      .first()
      .props().value).to.equal(true);
  });

  it('value is false if promotionOption does not exists', () => {
    props.promotionLotId = 'a';
    props.promotionOptions = [{ promotionLots: [{ _id: 'b' }] }];

    expect(component()
      .find('Checkbox')
      .first()
      .props().value).to.equal(false);
  });
});
