/* eslint-env mocha */
import { expect } from 'chai';
import merge from 'lodash/merge';

import widget1Suggesters, { makeSuggestValue } from '../widget1Suggestion';
import {
  PURCHASE_TYPE,
  SALARY,
  PROPERTY,
  FORTUNE,
  WANTED_LOAN,
} from '../widget1Constants';

const value = 100;
const prepareState = overrides => ({
  widget1: merge(
    {
      purchaseType: PURCHASE_TYPE.ACQUISITION,
      property: { value, auto: false },
      salary: { value, auto: false },
      fortune: { value, auto: false },
      currentLoan: { value, auto: false },
      wantedLoan: { value, auto: false },
    },
    overrides,
  ),
});

describe('suggestValue', () => {
  let suggesters;
  const createSuggestValue = () => makeSuggestValue(suggesters);

  beforeEach(() => {
    suggesters = {
      [PURCHASE_TYPE.ACQUISITION]: {
        [SALARY]: {},
      },
      [PURCHASE_TYPE.REFINANCING]: {},
    };
  });

  it('should not suggest a value if it is currently manual', () => {
    expect(createSuggestValue()('salary', prepareState())).to.equal(value);
  });

  it('should suggest a value with "all" if it is in auto and the others false', () => {
    suggesters[PURCHASE_TYPE.ACQUISITION][SALARY].all = () => 1;
    expect(createSuggestValue()('salary', prepareState({ salary: { auto: true } }))).to.equal(1);
  });

  it('should suggest a value with "fortune" if property is in auto', () => {
    suggesters[PURCHASE_TYPE.ACQUISITION][SALARY].fortune = () => 1;
    expect(createSuggestValue()(
      'salary',
      prepareState({ salary: { auto: true }, property: { auto: true } }),
    )).to.equal(1);
  });

  it('should use the default suggester if none is found', () => {
    suggesters[PURCHASE_TYPE.ACQUISITION][SALARY] = { default: () => 42 };
    expect(createSuggestValue()(SALARY, prepareState({ salary: { auto: true } }))).to.equal(42);
  });
});

describe('widget1Suggesters', () => {
  describe('salary', () => {
    it('suggests a salary with all', () => {
      expect(widget1Suggesters(
        SALARY,
        prepareState({
          salary: { auto: true },
          property: { auto: false },
          fortune: { auto: false },
        }),
      )).to.equal(5);
    });

    it('suggests a salary with all and proper values', () => {
      expect(widget1Suggesters(
        SALARY,
        prepareState({
          salary: { auto: true },
          property: { auto: false, value: 1000000 },
          fortune: { auto: false, value: 250000 },
        }),
        // + 1 here because of rounding issues
      )).to.equal(180000 + 1);
    });

    it('suggests a salary with property', () => {
      expect(widget1Suggesters(
        SALARY,
        prepareState({
          salary: { auto: true },
          property: { auto: false },
          fortune: { auto: true },
        }),
      )).to.be.within(18, 18.1);
    });

    it('suggests a salary with fortune', () => {
      expect(widget1Suggesters(
        SALARY,
        prepareState({
          salary: { auto: true },
          property: { auto: true },
          fortune: { auto: false },
        }),
      )).to.be.within(72, 72.1);
    });
  });

  describe('fortune', () => {
    it('suggests a fortune with all', () => {
      expect(widget1Suggesters(
        FORTUNE,
        prepareState({
          salary: { auto: false },
          property: { auto: false },
          fortune: { auto: true },
        }),
      )).to.equal(25);
    });

    it('suggests a fortune with all and proper values', () => {
      expect(widget1Suggesters(
        FORTUNE,
        prepareState({
          property: { auto: false, value: 1000000 },
          salary: { auto: false, value: 180000 },
          fortune: { auto: true },
        }),
      )).to.equal(250000);
    });

    it('suggests a fortune with property', () => {
      expect(widget1Suggesters(
        FORTUNE,
        prepareState({
          salary: { auto: true },
          property: { auto: false },
          fortune: { auto: true },
        }),
      )).to.be.within(24.9, 25);
    });

    it('suggests a fortune with salary', () => {
      expect(widget1Suggesters(
        FORTUNE,
        prepareState({
          salary: { auto: false },
          property: { auto: true },
          fortune: { auto: true },
        }),
      )).to.be.within(138.9, 139);
    });
  });

  describe('property', () => {
    it('suggests a property with all', () => {
      expect(widget1Suggesters(
        PROPERTY,
        prepareState({
          salary: { auto: false },
          property: { auto: true },
          fortune: { auto: false },
        }),
      )).to.equal(400);
    });

    it('suggests a property with proper values', () => {
      expect(widget1Suggesters(
        PROPERTY,
        prepareState({
          salary: { auto: false, value: 180000 },
          property: { auto: true },
          fortune: { auto: false, value: 250000 },
        }),
      )).to.equal(1000000);
    });

    it('suggests a property with salary', () => {
      expect(widget1Suggesters(
        PROPERTY,
        prepareState({
          salary: { auto: false },
          property: { auto: true },
          fortune: { auto: true },
        }),
      )).to.equal(556);
    });

    it('suggests a property with fortune', () => {
      expect(widget1Suggesters(
        PROPERTY,
        prepareState({
          salary: { auto: true },
          property: { auto: true },
          fortune: { auto: false },
        }),
      )).to.be.within(400, 400.1);
    });
  });

  describe('wantedLoan', () => {
    it('suggests a wantedLoan with currentLoan', () => {
      expect(widget1Suggesters(
        WANTED_LOAN,
        prepareState({
          wantedLoan: { auto: true },
          currentLoan: { auto: false, value: 42 },
          fortune: { auto: false },
          purchaseType: PURCHASE_TYPE.REFINANCING,
        }),
      )).to.equal(42);
    });
  });
});
