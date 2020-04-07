/* eslint-env mocha */
import { expect } from 'chai';

import {
  TOOLTIP_LISTS,
  generalTooltips,
  offerTableTooltips,
  tooltips,
  tooltipsById,
} from '../tooltips';

describe('tooltips', () => {
  describe('tooltip lists', () => {
    [
      { list: generalTooltips, name: 'general' },
      { list: offerTableTooltips, name: 'offerTable' },
    ].forEach(({ list, name }) => {
      describe(`List: ${name}`, () => {
        it('is made of objects with at least an id', () => {
          const tooltipTargets = Object.keys(list);

          tooltipTargets.forEach(tooltipTarget => {
            const value = list[tooltipTarget];
            expect(value).to.be.an('object');
            expect(value.id).to.be.a('string');
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
      expect(typeof tooltips(TOOLTIP_LISTS.GENERAL)).to.equal('object');
    });
  });

  describe('tooltipsById', () => {
    it("throws if the id given isn't made of 2 strings with a dot", () => {
      expect(() => tooltipsById('')).to.throw('Wrong');
      expect(() => tooltipsById(TOOLTIP_LISTS.GENERAL)).to.throw('Wrong');
      expect(() => tooltipsById(1)).to.throw('string');
      expect(() => tooltipsById(`${TOOLTIP_LISTS.GENERAL}.`)).to.throw('Wrong');
    });

    it('returns undefined for a non-existent tooltip', () => {
      expect(tooltipsById(`${TOOLTIP_LISTS.GENERAL}.noexist`)).to.equal(
        undefined,
      );
    });
  });
});
