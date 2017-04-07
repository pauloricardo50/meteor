import { expect } from 'chai';
import { describe, it } from 'meteor/practicalmeteor:mocha';

import { toMoney, toNumber, toDecimalNumber } from './conversionFunctions';

describe('Conversion functions', () => {
  describe('To money', () => {
    it("Should return '1'000' for 1000", () => {
      expect(toMoney(1000)).to.equal("1'000");
    });

    it('Should return 0 for 0', () => {
      expect(toMoney(0)).to.equal(0);
    });

    it("Should return '100'000' for 100000", () => {
      expect(toMoney(100000)).to.equal("100'000");
    });

    it("Should return '100'000' for -100000", () => {
      expect(toMoney(-100000)).to.equal("100'000");
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
  });
});
