/* eslint-env mocha */
import { expect } from 'chai';

import Calculator from '..';

describe('Calculator Selector', () => {
  let params;
  let structure;
  let property;

  beforeEach(() => {
    property = { value: 100 };
    structure = { id: 'struct', propertyId: 'prop', property };
    params = {
      loan: { structure, structures: [structure], properties: [property] },
    };
  });

  describe('selectProperty', () => {
    it('returns an empty object if nothing is on the structure', () => {
      expect(Calculator.selectProperty(params)).to.deep.equal(property);
    });

    it('returns the property if it exists', () => {
      const property = { yo: 'dude' };
      params.loan.structure.property = property;
      expect(Calculator.selectProperty(params)).to.deep.equal(property);
    });

    it('returns the promotionOption if it exists, and there is no property', () => {
      const promotionOption = {
        promotionLots: [{ properties: [{}] }],
        value: 100,
      };
      structure.promotionOption = promotionOption;
      structure.property = undefined;
      structure.propertyId = undefined;
      expect(Calculator.selectProperty(params)).to.deep.include({
        ...promotionOption,
        totalValue: 100,
      });
    });

    context('with a structureId', () => {
      beforeEach(() => {
        params.structureId = 'struct';
      });

      it('returns an empty object if nothing is on the structure', () => {
        structure.property = undefined;
        structure.propertyId = undefined;
        expect(Calculator.selectProperty(params)).to.deep.equal({});
      });

      it('returns the property if it exists', () => {
        property = { _id: 'dude' };
        structure.propertyId = property._id;
        params.loan.properties = [property];
        expect(Calculator.selectProperty(params)).to.deep.equal(property);
      });

      it('returns the promotionOption if it exists', () => {
        const promotionOption = {
          _id: 'dawg',
          promotionLots: [{ properties: [{}] }],
          value: 100,
        };
        structure.promotionOptionId = promotionOption._id;
        structure.propertyId = undefined;
        params.loan.promotionOptions = [promotionOption];
        expect(Calculator.selectProperty(params)).to.deep.include({
          ...promotionOption,
          totalValue: 100,
        });
      });
    });
  });

  describe('selectPropertyValue', () => {
    it('returns the propertyValue on the structure, even if propertyValue or totalValue exists', () => {
      structure.propertyValue = 300;
      property.totalValue = 200;
      expect(Calculator.selectPropertyValue(params)).to.equal(300);
    });

    it('returns the totalValue if it exists', () => {
      property.totalValue = 200;
      expect(Calculator.selectPropertyValue(params)).to.equal(200);
    });

    it('returns the property value if it exists', () => {
      expect(Calculator.selectPropertyValue(params)).to.equal(100);
    });

    it('returns 0 if there is no property', () => {
      property = undefined;
      structure.propertyValue = undefined;
      structure.propertyId = undefined;
      structure.property = undefined;
      expect(Calculator.selectPropertyValue(params)).to.equal(0);
    });

    it('returns the right value for a promotionOption with additionalLots', () => {
      const promotionOption = {
        _id: 'dawg',
        value: 110,
        promotionLots: [
          {
            properties: [{ value: 100, totalValue: 100 }],
            lots: [{ value: 10 }, { value: 0 }],
          },
        ],
      };
      structure.promotionOptionId = promotionOption._id;
      structure.property = undefined;
      structure.propertyId = undefined;
      params.loan.promotionOptions = [promotionOption];
      expect(Calculator.selectPropertyValue(params)).to.deep.equal(110);
    });
  });

  describe('makeSelectPropertyKey', () => {
    it('returns the exact value of a property for a promotionOption', () => {
      const params = {
        loan: {
          structures: [{ id: 'dude', promotionOptionId: 'yo' }],
          promotionOptions: [
            {
              _id: 'yo',
              value: 100,
              promotionLots: [{ properties: [{ value: 0 }] }],
            },
          ],
        },
        structureId: 'dude',
      };
      expect(Calculator.makeSelectPropertyKey('value')(params)).to.equal(0);
    });
  });
});
