// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import Calculator from '..';

describe('Calculator Selector', () => {
  let params;

  beforeEach(() => {
    params = {
      loan: { structure: { id: 'struct' }, structures: [{ id: 'struct' }] },
    };
  });

  describe('selectProperty', () => {
    it('returns an empty object if nothing is on the structure', () => {
      expect(Calculator.selectProperty(params)).to.deep.equal({});
    });

    it('returns the property if it exists', () => {
      const property = { yo: 'dude' };
      params.loan.structure.property = property;
      expect(Calculator.selectProperty(params)).to.deep.equal(property);
    });

    it('returns the promotionOption if it exists', () => {
      const promotionOption = { promotionLots: [{ properties: [{}] }] };
      params.loan.structure.promotionOption = promotionOption;
      expect(Calculator.selectProperty(params)).to.deep.equal(promotionOption);
    });

    context('with a structureId', () => {
      beforeEach(() => {
        params.structureId = 'struct';
      });

      it('returns an empty object if nothing is on the structure', () => {
        expect(Calculator.selectProperty(params)).to.deep.equal({});
      });

      it('returns the property if it exists', () => {
        const property = { _id: 'dude' };
        params.loan.structures[0].propertyId = property._id;
        params.loan.properties = [property];
        expect(Calculator.selectProperty(params)).to.deep.equal(property);
      });

      it('returns the promotionOption if it exists', () => {
        const promotionOption = {
          _id: 'dawg',
          promotionLots: [{ properties: [{}] }],
        };
        params.loan.structures[0].promotionOptionId = promotionOption._id;
        params.loan.promotionOptions = [promotionOption];
        expect(Calculator.selectProperty(params)).to.deep.equal(promotionOption);
      });
    });
  });
});
