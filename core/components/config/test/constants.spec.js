/* eslint-env mocha */
import { expect } from 'chai';

import { USAGE_TYPE } from 'core/api/constants';
import constants, { calculatePrimaryProperty } from '../constants';

describe('Constants', () => {
    it('loanCost should return the right value', () => {
        expect(constants.loanCost(0.8)).to.equal(0.0625);
    });

    it('loanCostReal should return the right value', () => {
        expect(constants.loanCostReal(0.8)).to.equal(0.0275);
    });

    it('loanCostReal should return the right value when given a specific rate', () => {
        expect(constants.loanCostReal(0.8, 20, 0.05)).to.equal(0.0625);
    });

    it('propertyToIncome should return the right value', () => {
        expect(constants.propertyToIncome('primary', 0.8).toFixed(2)).to.equal('0.18');
    });

    it('propertyToIncomeReal should return the right value', () => {
        expect(constants.propertyToIncomeReal('primary', 0.8).toFixed(2)).to.equal('0.08');
    });

    describe('Calculate primary property value', () => {
        it('Should return 1M if 250k fortune and 0 insurance fortune', () => {
            expect(calculatePrimaryProperty(250000, 0)).to.equal(1000000);
        });

        it('Should return 1M if 160k fortune and 100k insurance fortune', () => {
            expect(calculatePrimaryProperty(160000, 100000)).to.equal(1000000);
        });

        it('Should return 1.5M if 275k fortune and 500k insurance fortune', () => {
            // 150k cash, 75k notary fees, 50k lppFees
            expect(calculatePrimaryProperty(275000, 500000)).to.equal(1500000);
        });

        it('Should return 0 if 0 fortune and any insurance fortune', () => {
            expect(calculatePrimaryProperty(0, 100000000)).to.equal(0);
        });

        it('Should return 0 if negative fortune and any insurance fortune', () => {
            expect(calculatePrimaryProperty(-100, 100000000)).to.equal(0);
        });

        it('Should return 0 if negative insurance fortune', () => {
            expect(calculatePrimaryProperty(100, -100000000)).to.equal(0);
        });
    });

    describe('Calculate maximum property value', () => {
        it('Should return 1M with 250k fortune, 0 insurance fortune, 500k income', () => {
            expect(constants.maxProperty(500000, 250000, 0, USAGE_TYPE.PRIMARY)).to.equal(1000000);
        });

        it('Should return 1M with 350k fortune, 0 insurance fortune, 500k income, and secondary usage', () => {
            expect(constants.maxProperty(500000, 350000, 0, USAGE_TYPE.SECONDARY)).to.equal(1000000);
        });

        it("Should return 1'506'542 with 500k fortune, 0 insurance fortune, 200k income", () => {
            expect(constants.maxProperty(200000, 500000, 0, USAGE_TYPE.PRIMARY)).to.equal(1506542);
        });

        it("Should return 1'742'056 with 500k fortune, 200k insurance fortune, 200k income", () => {
            expect(constants.maxProperty(200000, 500000, 200000, USAGE_TYPE.PRIMARY)).to.equal(1742056);
        });
    });

    describe('Get amortization', () => {
        it('Should return 1.25% without values', () => {
            expect(constants.getAmortization()).to.equal(0.0125);
        });

        it('Should return 1.25% if retirement is more than 15 years away for 80% debt', () => {
            expect(constants.getAmortization(0.8, 16)).to.equal(0.0125);
        });

        it('Should return 0.47% for 70% debt', () => {
            expect(constants.getAmortization(0.7, 20)).to.equal(0.00476190476190476);
        });

        it('Should return 0.71% for 70% debt with retirement in 10 years', () => {
            expect(constants.getAmortization(0.7, 10)).to.equal(0.00714285714285713);
        });

        it('Should return 0 for any borrow value below 65%', () => {
            expect(constants.getAmortization(0.5, 50)).to.equal(0);
        });
    });
});
