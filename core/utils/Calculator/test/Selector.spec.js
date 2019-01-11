// @flow
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
      const promotionOption = { promotionLots: [{ properties: [{}] }] };
      structure.promotionOption = promotionOption;
      structure.property = undefined;
      expect(Calculator.selectProperty(params)).to.deep.equal(promotionOption);
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
        };
        structure.promotionOptionId = promotionOption._id;
        structure.propertyId = undefined;
        params.loan.promotionOptions = [promotionOption];
        expect(Calculator.selectProperty(params)).to.deep.equal(promotionOption);
      });
    });
  });

  describe('selectPropertyValue', () => {
    it('returns the propertyValue on the structure, even if propertyValue or totalValue exists', () => {
      structure.propertyValue = 300;
      property.totalValue = 200;
      expect(Calculator.selectPropertyValue(params)).to.deep.equal(300);
    });

    it('returns the totalValue if it exists', () => {
      property.totalValue = 200;
      expect(Calculator.selectPropertyValue(params)).to.deep.equal(200);
    });

    it('returns the property value if it exists', () => {
      expect(Calculator.selectPropertyValue(params)).to.deep.equal(100);
    });
  });
});
