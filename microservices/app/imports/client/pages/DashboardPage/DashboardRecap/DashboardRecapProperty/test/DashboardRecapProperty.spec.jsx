/* eslint-env mocha */
import { expect } from 'chai';
import React from 'react';

import { VALUATION_STATUS } from 'core/api/properties/propertyConstants';
import { toMoney } from 'core/utils/conversionFunctions';
import { getRecapArray } from '../DashboardRecapProperty';

describe('getRecapArray', () => {
  it.skip('returns min and max if valuation is done', () => {
    // Test code
    const min = 12345;
    const max = 123456;
    const status = VALUATION_STATUS.DONE;
    const property = {
      address1: 'Rue du test 12',
      zipCode: 1201,
      city: 'Genève',
      landArea: 129,
      insideArea: 123,
      valuation: {
        status,
        min,
        max,
      },
    };
    expect(getRecapArray(property)[3].value.props.children).to.contain(toMoney(min));
    expect(getRecapArray(property)[3].value.props.children).to.contain(toMoney(max));
  });

  it.skip('returns expertise status if valuation is not done', () => {
    const status = VALUATION_STATUS.NONE;
    const property = {
      address1: 'Rue du test 12',
      zipCode: 1201,
      city: 'Genève',
      landArea: 129,
      insideArea: 123,
      valuation: {
        status,
      },
    };
    expect(getRecapArray(property)[3].value.props.id).to.equal('property.expertiseStatus.NONE');
  });
});
