import {
  ACTIONS,
  CURRENT_LOAN,
  PROPERTY,
  PURCHASE_TYPE,
  SALARY,
} from '../wwwCalculatorConstants';
import { initialState, wwwCalculatorReducer } from '../WwwCalculatorState';

describe('WwwCalculator', () => {
  it('sets regular state', () => {
    const newState = wwwCalculatorReducer(
      {},
      {
        type: ACTIONS.SET,
        payload: { purchaseType: PURCHASE_TYPE.ACQUISITION },
      },
    );

    expect(newState).toEqual({ purchaseType: PURCHASE_TYPE.ACQUISITION });
  });

  it('sets nested state', () => {
    const newState = wwwCalculatorReducer(initialState, {
      type: ACTIONS.SET_VALUE,
      payload: { at: SALARY, value: 100 },
    });

    expect(newState.salary).toEqual({
      value: 100,
      isAuto: false,
      sliderMax: 500000,
    });
  });

  it('sets auto values for other fields', () => {
    const newState = wwwCalculatorReducer(initialState, {
      type: ACTIONS.SET_VALUE,
      payload: { at: PROPERTY, value: 1000000 },
    });

    expect(newState.fortune.value).toEqual(250000);
    expect(newState.salary.value).toEqual(180000);
  });

  it('sets all values to 0 if all are set to auto', () => {
    const newState = wwwCalculatorReducer(
      {
        purchaseType: PURCHASE_TYPE.ACQUISITION,
        salary: { isAuto: false },
        property: { isAuto: true },
        fortune: { isAuto: true, value: 1000 },
      },
      {
        type: ACTIONS.SET_VALUE,
        payload: { at: SALARY, isAuto: true },
      },
    );
    expect(newState.fortune.value).toEqual(0);
  });

  it('uses the default suggester when needed', () => {
    const newState = wwwCalculatorReducer(
      {
        purchaseType: PURCHASE_TYPE.REFINANCING,
        salary: { isAuto: false },
        property: { isAuto: true },
        fortune: { isAuto: true, value: 1000 },
        currentLoan: {},
        wantedLoan: { isAuto: true },
      },
      {
        type: ACTIONS.SET_VALUE,
        payload: { at: CURRENT_LOAN, value: 1000 },
      },
    );

    expect(newState.wantedLoan.value).toEqual(1000);
  });
});
