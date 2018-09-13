// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import PropertyCalculator from '..';
import { PROPERTY_DOCUMENTS, DOCUMENTS } from '../../../api/constants';

describe('PropertyCalculator', () => {
  let params;
  let property;

  beforeEach(() => {
    property = {};
    params = {
      loan: { general: {}, structure: { property }, borrowers: [{}] },
    };
  });

  describe('propertyPercent', () => {
    it('returns 0 for a new property', () => {
      expect(PropertyCalculator.propertyPercent(params)).to.deep.equal(0);
    });

    it('returns 1 for a complete property', () => {
      params.loan.structure.property = {
        value: 1,
        propertyType: '',
        address1: 'yo',
        zipCode: 1000,
        constructionYear: 2000,
        roomCount: 2,
        minergie: '',
        qualityProfileCondition: 1,
        qualityProfileStandard: 2,
      };
      params.loan.general.residenceType = ' ';
      expect(PropertyCalculator.propertyPercent(params)).to.deep.equal(1);
    });
  });

  describe('getPropAndWork', () => {
    it('sums propertyWork and property value', () => {
      params.loan.structure.property.value = 1;
      params.loan.structure.propertyWork = 2;
      expect(PropertyCalculator.getPropAndWork(params)).to.deep.equal(3);
    });
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
        'minergie',
        'qualityProfileCondition',
        'qualityProfileStandard',
        'general.residenceType',
      ]);
    });
  });

  describe('getMissingPropertyDocuments', () => {
    it('returns the list of missing documents from a property', () => {
      expect(PropertyCalculator.getMissingPropertyDocuments(params)).to.deep.equal([DOCUMENTS.PROPERTY_PLANS, DOCUMENTS.PROPERTY_PICTURES]);
    });

    it('returns the list of missing documents from a property', () => {
      params.loan.structure.property.documents = {
        [DOCUMENTS.PROPERTY_PLANS]: [{}],
        [DOCUMENTS.PROPERTY_PICTURES]: [{}],
      };
      expect(PropertyCalculator.getMissingPropertyDocuments(params)).to.deep.equal([]);
    });
  });
});
