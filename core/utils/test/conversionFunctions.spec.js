/* eslint-env mocha */
import { expect } from 'chai';

import {
  toMoney,
  toNumber,
  toDecimalNumber,
  toDistanceString,
} from '../conversionFunctions';

describe('Conversion functions', () => {
  describe('To money', () => {
    it("Should return '1 000' for 1000", () => {
      expect(toMoney(1000)).to.equal('1 000');
    });

    it('Should return 0 for 0', () => {
      expect(toMoney(0)).to.equal(0);
    });

    it("Should return '100 000' for 100000", () => {
      expect(toMoney(100000)).to.equal('100 000');
    });

    it("Should return '-100 000' for -100000", () => {
      expect(toMoney(-100000)).to.equal('-100 000');
    });
  });

  describe('To number', () => {
    it("Should return 0 for 'a'", () => {
      expect(toNumber('a')).to.equal(0);
    });

    it('Should return 100 for 100', () => {
      expect(toNumber(100)).to.equal(100);
    });

    it("Should return 100 for '100'", () => {
      expect(toNumber('100')).to.equal(100);
    });

    it('Should return 100.9 for 100.9', () => {
      expect(toNumber(100.9)).to.equal(100.9);
    });

    it("Should return 1009 for '100.9'", () => {
      expect(toNumber('100.9')).to.equal(1009);
    });

    it('should return the same value if given a falsy non-number', () => {
      expect(toNumber('')).to.equal('');
      expect(toNumber(undefined)).to.equal(undefined);
      expect(toNumber(null)).to.equal(null);
      expect(toNumber(false)).to.equal(false);
    });

    it('should return 0 if given true', () => {
      expect(toNumber(true)).to.equal(0);
    });
  });

  describe('To decimal number', () => {
    it("Should return 0.1 for '0.1'", () => {
      expect(toDecimalNumber('0.1')).to.equal(0.1);
    });

    it("Should return 0.1 for '0,1'", () => {
      expect(toDecimalNumber('0,1')).to.equal(0.1);
    });

    it("Should return 1 for '1'", () => {
      expect(toDecimalNumber('1')).to.equal(1);
    });

    it("Should return 1 for '001'", () => {
      expect(toDecimalNumber('001')).to.equal(1);
    });

    it('Should return -1 for -1', () => {
      expect(toDecimalNumber(-1)).to.equal(-1);
    });

    it('should return the same value if given a falsy non-number', () => {
      expect(toDecimalNumber('')).to.equal('');
      expect(toDecimalNumber(undefined)).to.equal(undefined);
      expect(toDecimalNumber(null)).to.equal(null);
      expect(toDecimalNumber(false)).to.equal(false);
    });
  });

  describe('To Distance String', () => {
    it('returns 0 for a negative distance', () => {
      expect(toDistanceString(-1)).to.equal('0 m');
    });

    it('returns 0 for 0', () => {
      expect(toDistanceString(0)).to.equal('0 m');
    });

    it('returns 80 for 81', () => {
      expect(toDistanceString(81)).to.equal('80 m');
    });

    it('returns 10 for 9', () => {
      expect(toDistanceString(9)).to.equal('10 m');
    });

    it('returns 420 for 425', () => {
      expect(toDistanceString(425)).to.equal('430 m');
    });

    it('returns 1.0 for 1000', () => {
      expect(toDistanceString(1000)).to.equal('1.0 km');
    });

    it('returns 5.4 for 5432', () => {
      expect(toDistanceString(5432)).to.equal('5.4 km');
    });

    it('returns 10 for 10000', () => {
      expect(toDistanceString(10000)).to.equal('10 km');
    });

    it('returns 55 for 54987', () => {
      expect(toDistanceString(54987)).to.equal('55 km');
    });
  });
});
