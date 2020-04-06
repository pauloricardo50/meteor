/* eslint-env mocha */
import { expect } from 'chai';

import {
  getBorrowerFinanceArray,
  getBorrowerInfoArray,
} from '../BorrowerFormArray';

describe('BorrowerFormArrays', () => {
  describe('getBorrowerInfoArray', () => {
    const borrowers = [{ _id: 'id1' }, { _id: 'id2' }, { _id: 'id3' }];

    it('throws an error if a wrong ID is passed', () => {
      expect(() =>
        getBorrowerInfoArray({ borrowers, borrowerId: 'id4' }),
      ).to.throw();
    });

    it('returns an array of objects, each having an id', () => {
      const array = getBorrowerInfoArray({ borrowers, borrowerId: 'id1' });

      expect(typeof array).to.equal('object');
      expect(array).to.have.length.above(0);
      array.forEach(field => {
        expect(typeof field).to.equal('object');
        if (field.type !== 'conditionalInput' && field.type !== 'h3') {
          expect(!!field.id).to.equal(true);
        }
      });
    });
  });

  describe('getBorrowerFinanceArray', () => {
    const borrowers = [{ _id: 'id1' }, { _id: 'id2' }, { _id: 'id3' }];

    it('throws an error if a wrong ID is passed', () => {
      expect(() =>
        getBorrowerFinanceArray({ borrowers, borrowerId: 'id4' }),
      ).to.throw();
    });

    it('returns an array of objects, each having an id', () => {
      const array = getBorrowerFinanceArray({ borrowers, borrowerId: 'id1' });

      expect(typeof array).to.equal('object');
      expect(array).to.have.length.above(0);
      array.forEach(field => {
        expect(typeof field).to.equal('object');
        if (field.type !== 'conditionalInput' && field.type !== 'h3') {
          expect(!!field.id).to.equal(true);
        }
      });
    });
  });
});
