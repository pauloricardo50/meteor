/* eslint-env mocha */
import { expect } from 'chai';

import {
  getBorrowerInfoArray,
  getBorrowerFinanceArray,
} from '../BorrowerFormArray';

describe('BorrowerFormArrays', () => {
  describe('getBorrowerInfoArray', () => {
    const borrowers = [{ _id: 'id1' }, { _id: 'id2' }, { _id: 'id3' }];

    it('throws an error if a wrong ID is passed', () => {
      expect(() => getBorrowerInfoArray(borrowers, 'id4')).to.throw();
    });

    it('returns an array of objects, each having an id', () => {
      const array = getBorrowerInfoArray(borrowers, 'id1');

      expect(typeof array).to.equal('object');
      expect(array).to.have.length.above(0);
      array.forEach((field) => {
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
      expect(() => getBorrowerFinanceArray(borrowers, 'id4')).to.throw();
    });

    it('returns an array of objects, each having an id', () => {
      const array = getBorrowerFinanceArray(borrowers, 'id1');

      expect(typeof array).to.equal('object');
      expect(array).to.have.length.above(0);
      array.forEach((field) => {
        expect(typeof field).to.equal('object');
        if (field.type !== 'conditionalInput' && field.type !== 'h3') {
          expect(!!field.id).to.equal(true);
        }
      });
    });
  });
});
