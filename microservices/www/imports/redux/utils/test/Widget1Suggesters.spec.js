/* eslint-env mocha */
import { expect } from 'chai';
import merge from 'lodash/merge';

import { makeSuggestValue } from '../widget1Suggesters';
import { PURCHASE_TYPE, SALARY } from '../../constants/widget1Constants';

const value = 100;
const prepareState = overrides => ({
  widget1: merge(
    {
      purchaseType: PURCHASE_TYPE.ACQUISITION,
      salary: { value, auto: false },
      property: { value, auto: false },
      fortune: { value, auto: false },
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
