/* eslint-env mocha */
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  MAX_BORROW_RATIO_PRIMARY_PROPERTY,
  MAX_BORROW_RATIO_WITH_INSURANCE,
} from 'core/config/financeConstants';
import * as widget1Actions from '../widget1Actions';
import * as widget1 from '../../reducers/widget1';
import {
  ALL_FIELDS,
  ACQUISITION_FIELDS,
  FINAL_STEP,
  PURCHASE_TYPE,
  CAPPED_FIELDS,
  WANTED_LOAN,
} from '../../constants/widget1Constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let store;
const expectActions = (actionCreator, expectedActions, comment) =>
  store.dispatch(actionCreator).then(() => {
    expect(store.getActions()).deep.equal(expectedActions, comment);
  });
const prepareStore = overrides =>
  mockStore({
    widget1: {
      ...ALL_FIELDS.reduce(
        (acc, name) => ({ ...acc, [name]: { value: 0, auto: true } }),
        {},
      ),
      step: FINAL_STEP,
      purchaseType: PURCHASE_TYPE.ACQUISITION,
      ...overrides,
    },
  });

describe('widget1Actions', () => {
  const NAME = 'testName';
  const value = 100;

  beforeEach(() => {
    store = prepareStore();
  });

  describe('suggestValues', () => {
    it('does not dispatch anything if the user is not at the full calculator', () => {
      store = prepareStore({ step: 0 });
      const expectedActions = [];
      return expectActions(widget1Actions.suggestValues(), expectedActions);
    });

    it('dispatches one action for each NAME if the step is the final one', () => {
      const expectedActions = ACQUISITION_FIELDS.map(name => ({
        type: widget1.suggestValueAction(name),
        value: 0,
      }));
      return expectActions(widget1Actions.suggestValues(), expectedActions);
    });

    it('suggests the right values for a 180k salary', () => {
      store = prepareStore();
      const expectedActions = ACQUISITION_FIELDS.map(name => ({
        type: widget1.suggestValueAction(name),
        value: 0,
      }));
      return expectActions(widget1Actions.suggestValues(), expectedActions);
    });
  });

  describe('setValue', () => {
    it('sets a value and suggests values', () => {
      const expectedActions = [
        { type: widget1.setValueAction(NAME), value },
        ...ACQUISITION_FIELDS.map(name => ({
          type: widget1.suggestValueAction(name),
          value: 0,
        })),
      ];

      return expectActions(
        widget1Actions.setValue(NAME, value),
        expectedActions,
      );
    });

    ALL_FIELDS.forEach((field) => {
      const cappedFields = CAPPED_FIELDS;

      it(`caps field ${field} at 80% of the property price`, () => {
        const propertyValue = 100;
        const nextValue = 200;
        store = prepareStore({ step: 0, property: { value: propertyValue } });
        const expectedActions = [
          {
            type: widget1.setValueAction(field),
            value: cappedFields.includes(field)
              ? MAX_BORROW_RATIO_PRIMARY_PROPERTY * propertyValue
              : nextValue,
          },
        ];

        return expectActions(
          widget1Actions.setValue(field, nextValue),
          expectedActions,
          `failed for field: ${field}`,
        );
      });
    });

    it('caps a field at 90% of the property price if allowExtremeValue is true', () => {
      const propertyValue = 100;
      const nextValue = 200;
      store = prepareStore({
        step: 0,
        property: { value: propertyValue },
        wantedLoan: { allowExtremeLoan: true },
      });
      const expectedActions = [
        {
          type: widget1.setValueAction(WANTED_LOAN),
          value: MAX_BORROW_RATIO_WITH_INSURANCE * propertyValue,
        },
      ];

      return expectActions(
        widget1Actions.setValue(WANTED_LOAN, nextValue),
        expectedActions,
      );
    });
  });

  describe('setAuto', () => {
    it('sets a value to auto, and resuggests all values', () => {
      const expectedActions = [
        { type: widget1.setAutoAction(NAME), auto: true },
        ...ACQUISITION_FIELDS.map(name => ({
          type: widget1.suggestValueAction(name),
          value: 0,
        })),
      ];

      return expectActions(widget1Actions.setAuto(NAME, true), expectedActions);
    });
  });

  describe('increaseSliderMax', () => {
    it('creates the right action', () => {
      const expectedActions = {
        type: widget1.increaseSliderMaxAction(NAME),
      };

      expect(widget1Actions.increaseSliderMax(NAME)).to.deep.equal(expectedActions);
    });
  });

  describe('setStep', () => {
    it('does not dispatch anything if the next step if lower than current step', () => {
      store = prepareStore({ step: 1 });
      const expectedActions = [];
      return expectActions(widget1Actions.setStep(0), expectedActions);
    });

    it('sets the step if it is not the final step', () => {
      store = prepareStore({ step: 0 });
      const expectedActions = [{ type: 'step_SET', value: 1 }];
      return expectActions(widget1Actions.setStep(1), expectedActions);
    });

    it('sets the step and suggests values if it will be the final step', () => {
      // getState does not work in redux-mock-store, so set the final step
      // initially as well to make sure getState gets the right value
      // for the `suggestValues` action
      store = prepareStore({ step: ACQUISITION_FIELDS.length });
      const expectedActions = [
        { type: 'step_SET', value: ACQUISITION_FIELDS.length },
        ...ACQUISITION_FIELDS.map(name => ({
          type: widget1.suggestValueAction(name),
          value: 0,
        })),
        { type: 'finishedTutorial_SET', value: true },
      ];
      return expectActions(
        widget1Actions.setStep(ACQUISITION_FIELDS.length),
        expectedActions,
      );
    });
  });

  describe('resetCalculator', () => {
    it('resets all the values', () => {
      const expectedActions = ALL_FIELDS.reduce(
        (acc, field) => [
          ...acc,
          { type: widget1.setValueAction(field), value: 0 },
          { type: widget1.setAutoAction(field), auto: true },
        ],
        [],
      );
      return expectActions(widget1Actions.resetCalculator(), expectedActions);
    });
  });
});
