// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import PropertyCalculator from '..';

describe('PropertyCalculator', () => {
  let params;
  let property;

  beforeEach(() => {
    property = {};
    params = {
      loan: { general: {}, structure: { property }, borrowers: [{}] },
    };
  });

  describe('getMissingPropertyFields', () => {
    it('returns the list of missing data from a property', () => {
      property = {};
      expect(PropertyCalculator.getMissingPropertyFields(params)).to.deep.equal([
        'value',
        'propertyType',
        'address1',
        'zipCode',
        'constructionYear',
        'roomCount',
        'parking.inside',
        'parking.outside',
        'minergie',
        'qualityProfile.condition',
        'qualityProfile.standard',
        'general.residenceType',
      ]);
    });
  });
});
