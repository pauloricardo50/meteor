/* eslint-env mocha */
import { expect } from 'chai';

import { ACTIONS, SALARY } from '../wwwCalculatorConstants';
import { wwwCalculatorReducer } from '../WwwCalculatorState';

describe('WwwCalculator', () => {
  it('sets nested state', () => {
    const newState = wwwCalculatorReducer(
      {},
      { type: ACTIONS.SET_VALUE, payload: { at: SALARY, value: 100 } },
    );

    expect(newState).to.deep.equal({ salary: { value: 100 } });
  });
});
