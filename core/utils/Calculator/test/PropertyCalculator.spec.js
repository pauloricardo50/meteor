// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import PropertyCalculator from '..';
import { PROPERTY_DOCUMENTS } from '../../../api/constants';

describe('PropertyCalculator', () => {
  let params;
  let property;

  beforeEach(() => {
    property = {};
    params = {
      loan: { general: {}, structure: { property }, borrowers: [{}] },
    };
  });

  describe('getPropertyFilesProgress', () => {
    it('returns 0 if no documents are provided', () => {
      property = {};
      expect(PropertyCalculator.getPropertyFilesProgress(params)).to.deep.equal(0);
    });

    it('returns 0.5 if one document is provided', () => {
      params.loan.structure.property = {
        documents: {
          [PROPERTY_DOCUMENTS.PROPERTY_PLANS]: [{}],
        },
      };
      expect(PropertyCalculator.getPropertyFilesProgress(params)).to.deep.equal(0.5);
    });
  });

  describe('getMissingPropertyFields', () => {
    it('returns the list of missing data from a property', () => {
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
