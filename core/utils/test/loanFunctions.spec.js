/* eslint-env mocha */
import { expect } from 'chai';

import { formatLoanWithStructure } from '../loanFunctions';

describe('Loan functions', () => {
  describe('formatLoanWithStructure', () => {
    it('sets the right structure', () => {
      expect(formatLoanWithStructure({
        selectedStructure: 'test',
        structures: [{ id: 'test', hello: 'world' }],
      })).to.deep.include({ id: 'test', hello: 'world' });
    });

    it('adds an empty structure if the structure was not found', () => {
      expect(formatLoanWithStructure({
        selectedStructure: 'test2',
        structures: [{ id: 'test', hello: 'world' }],
      })).to.deep.include({});
    });

    it('adds an empty structure if selectedStructure is not defined', () => {
      expect(formatLoanWithStructure({
        structures: [{ id: 'test', hello: 'world' }],
      })).to.deep.equal({});
    });

    it('adds the right property if it exists', () => {
      expect(formatLoanWithStructure({
        properties: [{ _id: 'property1', value: 100 }],
        selectedStructure: 'test',
        structures: [{ id: 'test', propertyId: 'property1' }],
      })).to.deep.include({
        id: 'test',
        propertyId: 'property1',
        property: { _id: 'property1', value: 100 },
      });
    });

    it('adds the right offer if it exists', () => {
      expect(formatLoanWithStructure({
        offers: [{ _id: 'offer1', amortization: 100 }],
        selectedStructure: 'test',
        structures: [{ id: 'test', offerId: 'offer1' }],
      })).to.deep.include({
        id: 'test',
        offerId: 'offer1',
        offer: { _id: 'offer1', amortization: 100 },
      });
    });

    it('adds both offer and property', () => {
      expect(formatLoanWithStructure({
        offers: [{ _id: 'offer1', amortization: 100 }],
        properties: [{ _id: 'property1', value: 100 }],
        selectedStructure: 'test',
        structures: [
          { id: 'test', offerId: 'offer1', propertyId: 'property1' },
        ],
      })).to.deep.include({
        id: 'test',
        offerId: 'offer1',
        propertyId: 'property1',
        offer: { _id: 'offer1', amortization: 100 },
        property: { _id: 'property1', value: 100 },
      });
    });
  });
});
