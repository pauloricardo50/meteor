/* eslint-env mocha */
import { expect } from 'chai';
import isArray from 'lodash/isArray';

import {
  tooltips,
  tooltipsById,
  generalTooltips,
  offerTableTooltips,
} from '../tooltips';

describe('tooltips', () => {
  describe('tooltip lists', () => {
    [
      { list: generalTooltips, name: 'general' },
      { list: offerTableTooltips, name: 'offerTable' },
    ].forEach((listObject) => {
      const list = listObject.list;
      describe(listObject.name, () => {
        it('is made of only strings and arrays of single strings', () => {
          const keys = Object.keys(list);

          keys.forEach((key) => {
            const value = list[key];

            if (typeof value === 'string') {
              return true;
            } else if (isArray(value)) {
              expect(value.length).to.equal(1);
              expect(typeof value[0]).to.equal('string');
            } else {
              throw new Error('invalid type');
            }
          });
        });
      });
    });
  });

  describe('tooltips func', () => {
    it('should throw if it is given an invalid list id', () => {
      expect(() => tooltips('wrong id')).to.throw();
    });

    it('should return an object if given a correct id', () => {
      expect(typeof tooltips('general')).to.equal('object');
    });
  });

  describe('tooltipsById', () => {
    it("throws if the id given isn't made of 2 strings with a dot", () => {
      expect(() => tooltipsById('')).to.throw('Wrong');
      expect(() => tooltipsById('general')).to.throw('Wrong');
      expect(() => tooltipsById(1)).to.throw('string');
      expect(() => tooltipsById('general.')).to.throw('Wrong');
      expect(() => tooltipsById('general.asd.asd')).to.throw('Wrong');
    });

    it('returns a string or an array from a list', () => {
      expect(isArray(tooltipsById('general.finma'))).to.equal(true);
      expect(typeof tooltipsById('general.lpp')).to.equal('string');
    });

    it('returns undefined for a non-existent tooltip', () => {
      expect(tooltipsById('general.noexist')).to.equal(undefined);
    });
  });
});
