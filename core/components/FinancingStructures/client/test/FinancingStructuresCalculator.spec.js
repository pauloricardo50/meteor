/* eslint-env mocha */
import { expect } from 'chai';

import { getPropertyValue } from '../FinancingStructuresOwnFunds/ownFundsHelpers';

describe('getPropertyValue', () => {
  it('should return the actual property value when the structure property value is undefined', () => {
    const propertyValue = 123456;
    const data = {
      structure: { propertyId: 'propertyId' },
      properties: [{ _id: 'propertyId', value: propertyValue }],
    };

    expect(getPropertyValue(data)).to.equal(propertyValue);
  });

  it('should return the actual property value when the structure property value is 0', () => {
    const propertyValue = 123456;
    const data = {
      structure: { propertyId: 'propertyId', propertyValue: 0 },
      properties: [{ _id: 'propertyId', value: propertyValue }],
    };

    expect(getPropertyValue(data)).to.equal(propertyValue);
  });

  it('should return the structure property value when it is defined and not equal to 0', () => {
    const propertyValue = 123456;
    const data = {
      structure: { propertyId: 'propertyId', propertyValue },
      properties: [{ _id: 'propertyId', value: 145784126 }],
    };

    expect(getPropertyValue(data)).to.equal(propertyValue);
  });
});
