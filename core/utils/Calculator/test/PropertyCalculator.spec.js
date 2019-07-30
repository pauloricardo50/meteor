// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import Calculator from '..';
import { PROPERTY_DOCUMENTS, DOCUMENTS, STEPS } from '../../../api/constants';
import { initialDocuments } from '../../../api/properties/propertiesAdditionalDocuments';

describe('PropertyCalculator', () => {
  let params;
  let property;

  beforeEach(() => {
    property = { _id: 'propertyId', additionalDocuments: initialDocuments };
    params = {
      loan: {
        structure: { property },
        borrowers: [{}],
        properties: [property],
        step: STEPS.SOLVENCY,
      },
    };
  });

  describe('propertyPercent', () => {
    it('returns 0 for a new property', () => {
      expect(Calculator.propertyPercent(params)).to.deep.equal(0);
    });

    it('returns 1 for a complete property', () => {
      params.loan.structure.property = {
        value: 1,
        propertyType: '',
        address1: 'yo',
        city: 'Genève',
        zipCode: 1000,
        canton: 'GE',
        constructionYear: 2000,
        numberOfFloors: 3,
        roomCount: 2,
        minergie: '',
        copropertyPercentage: 100,
        isCoproperty: false,
      };
      params.loan.residenceType = ' ';
      expect(Calculator.propertyPercent(params)).to.deep.equal(1);
    });
  });

  describe('getPropAndWork', () => {
    it('sums propertyWork and property value', () => {
      params.loan.structure.property.value = 1;
      params.loan.structure.propertyWork = 2;
      expect(Calculator.getPropAndWork(params)).to.deep.equal(3);
    });
  });

  describe('getPropertyFilesProgress', () => {
    it('returns 0 if no documents are provided', () => {
      property = {};
      expect(Calculator.getPropertyFilesProgress(params)).to.deep.equal({
        percent: 0,
        count: 1,
      });
    });

    it('returns 1/6 if one document is provided', () => {
      params.loan.structure.property = {
        documents: { [PROPERTY_DOCUMENTS.PROPERTY_PLANS]: [{}] },
        _id: 'propertyId',
      };
      expect(Calculator.getPropertyFilesProgress(params)).to.deep.equal({
        percent: 1 / 6,
        count: 6,
      });
    });
  });

  describe('getMissingPropertyFields', () => {
    it('returns the list of missing data from a property', () => {
      expect(Calculator.getMissingPropertyFields(params)).to.deep.equal([
        'value',
        'propertyType',
        'isCoproperty',
        'copropertyPercentage',
        'address1',
        'zipCode',
        'city',
        'canton',
        'numberOfFloors',
        'constructionYear',
        'roomCount',
        'minergie',
        'residenceType',
      ]);
    });
  });

  describe('getMissingPropertyDocuments', () => {
    it('returns the list of missing documents from a property 1', () => {
      expect(Calculator.getMissingPropertyDocuments(params)).to.deep.equal(initialDocuments.map(({ id }) => id));
    });

    it('returns the list of missing documents from a property 2', () => {
      params.loan.structure.property.documents = {
        [DOCUMENTS.PROPERTY_PLANS]: [{}],
        [DOCUMENTS.PROPERTY_PICTURES]: [{}],
      };
      expect(Calculator.getMissingPropertyDocuments(params)).to.deep.equal(initialDocuments
        .map(({ id }) => id)
        .filter(id =>
          ![DOCUMENTS.PROPERTY_PLANS, DOCUMENTS.PROPERTY_PICTURES].includes(id)));
    });
  });

  describe('hasDetailedPropertyValue', () => {
    it('returns false for a simple property', () => {
      params = {
        loan: { structure: { property: { value: 100 } } },
      };
      expect(Calculator.hasDetailedPropertyValue(params)).to.equal(false);
    });

    it('returns true for a detailed property', () => {
      params = {
        loan: {
          structure: {
            property: {
              landValue: 100,
              additionalMargin: 100,
              constructionValue: 200,
            },
          },
        },
      };
      expect(Calculator.hasDetailedPropertyValue(params)).to.equal(true);
    });

    it('returns true if both are provided', () => {
      params = {
        loan: {
          structure: {
            property: {
              value: 5,
              landValue: 100,
              additionalMargin: 100,
              constructionValue: 200,
            },
          },
        },
      };
      expect(Calculator.hasDetailedPropertyValue(params)).to.equal(true);
    });

    it('works for promotionOption structures', () => {
      params = {
        loan: {
          structure: {
            promotionOption: {
              value: 50,
              promotionLots: [
                {
                  properties: [
                    {
                      landValue: 100,
                      additionalMargin: 100,
                      constructionValue: 200,
                    },
                  ],
                },
              ],
            },
          },
        },
      };
      expect(Calculator.hasDetailedPropertyValue(params)).to.equal(true);
    });

    it('works for specific promotionOption structures', () => {
      params = {
        loan: {
          structures: [{ id: 'yo', promotionOptionId: 'option1' }],
          promotionOptions: [
            {
              value: 500,
              _id: 'option1',
              promotionLots: [
                {
                  properties: [
                    {
                      landValue: 100,
                      additionalMargin: 100,
                      constructionValue: 200,
                    },
                  ],
                },
              ],
            },
          ],
        },
        structureId: 'yo',
      };
      expect(Calculator.hasDetailedPropertyValue(params)).to.equal(true);
    });
  });
});
