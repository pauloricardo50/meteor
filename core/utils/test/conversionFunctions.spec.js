/* eslint-env mocha */
import { expect } from 'chai';

import {
  toMoney,
  toNumber,
  toDecimalNumber,
  toDistanceString,
  roundTo,
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

    it('rounds decimal numbers', () => {
      expect(toMoney(1000.2)).to.equal('1 000');
    });

    it('rounds decimal numbers', () => {
      expect(toMoney(1000.8)).to.equal('1 001');
    });

    it('returns undefined for undefined', () => {
      expect(toMoney(undefined)).to.equal(undefined);
    });

    it('returns an empty string for an empty string', () => {
      expect(toMoney('')).to.equal('');
    });

    it('shouldnt add a negative sign if the value is close to 0', () => {
      expect(toMoney(-0.1)).to.equal('0');
    });

    describe('rounded = false', () => {
      it('should allow decimals', () => {
        expect(toMoney(123456.78, { rounded: false })).to.equal('123 456.78');
      });

      it('works below 1', () => {
        expect(toMoney(0.45, { rounded: false })).to.equal('0.45');
      });

      it('should only show the last 2 decimals', () => {
        expect(toMoney(0.129, { rounded: false })).to.equal('0.13');

        expect(toMoney(0.1234, { rounded: false })).to.equal('0.12');

        expect(toMoney(0.12345, { rounded: false })).to.equal('0.12');
      });

      it('should round to 2 decimals', () => {
        expect(toMoney(0.9999999, { rounded: false })).to.equal('1.00');
      });

      it('should handle negative values', () => {
        expect(toMoney(-0.9999999, { rounded: false })).to.equal('-1.00');
        expect(toMoney(-123456.789, { rounded: false })).to.equal('-123 456.79');
      });
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

    it('should return number types', () => {
      expect(toNumber('1 000 000')).to.equal(1000000);
      expect(typeof toNumber('1 000 000')).to.equal('number');
    });

    it('returns undefined for undefined', () => {
      expect(toNumber(undefined)).to.equal(undefined);
    });

    it('returns an empty string for an empty string', () => {
      expect(toNumber('')).to.equal('');
    });
  });

  describe.only('To decimal number', () => {
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

    it("Should return -1000.1 for '-1000.1'", () => {
      expect(toDecimalNumber('-1000.1')).to.equal(-1000.1);
    });

    it("Should return -1000.1 for '-1000,1'", () => {
      expect(toDecimalNumber('-1000,1')).to.equal(-1000.1);
    });

    it("Should return -1000.1 for '-1 000,1'", () => {
      expect(toDecimalNumber('-1 000,1')).to.equal(-1000.1);
    });

    it("Should return -0.1 for '-0,1'", () => {
      expect(toDecimalNumber('-0,1')).to.equal(-0.1);
    });

    it('Should return -. for -.', () => {
      expect(toDecimalNumber('-.')).to.equal('-.');
    });

    it('Should return - for -', () => {
      expect(toDecimalNumber('-')).to.equal('-');
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

  describe('roundTo', () => {
    it('rounds to nearest 10000', () => {
      expect(roundTo(12345, 4)).to.equal(10000);
    });

    it('rounds to nearest 10', () => {
      expect(roundTo(12, 1)).to.equal(10);
    });

    it('rounds 1 to nearest 10000', () => {
      expect(roundTo(1, 4)).to.equal(0);
    });

    it('rounds decimal values to decimal places', () => {
      expect(roundTo(0.5689, -2)).to.equal(0.57);
    });

    it('does nothing if 0 is used', () => {
      expect(roundTo(123.456789, 0)).to.equal(123.456789);
    });

    it('rounds 0 properly', () => {
      expect(roundTo(0, 4)).to.equal(0);
      expect(roundTo(0, 0)).to.equal(0);
      expect(roundTo(0, -4)).to.equal(0);
    });

    it('parses strings with numbers to get a number out of it', () => {
      expect(roundTo('123', 2)).to.equal(100);
      expect(roundTo('123.321', -2)).to.equal(123.32);
    });

    it('parses weird strings as NaN', () => {
      expect(roundTo('hello', 3)).to.deep.equal(NaN);
    });
  });
});
