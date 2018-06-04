/* eslint-env mocha */
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as widget1Actions from '../widget1Actions';
import * as widget1Constants from '../../reducers/widget1';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let store;
const expectActions = (actionCreator, expectedActions) =>
  store.dispatch(actionCreator).then(() => {
    expect(store.getActions()).deep.equal(expectedActions);
  });
const prepareStore = overrides =>
  mockStore({
    widget1: {
      step: widget1Constants.FINAL_STEP,
      ...widget1Constants.NAMES.reduce(
        (acc, name) => ({ ...acc, [name]: { value: 0, auto: true } }),
        {},
      ),
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
      const expectedActions = widget1Constants.NAMES.map(name => ({
        type: widget1Constants.suggestValueAction(name),
        value: 0,
      }));
      return expectActions(widget1Actions.suggestValues(), expectedActions);
    });

    it('suggests the right values for a 180k salary', () => {
      store = prepareStore();
      const expectedActions = widget1Constants.NAMES.map(name => ({
        type: widget1Constants.suggestValueAction(name),
        value: 0,
      }));
      return expectActions(widget1Actions.suggestValues(), expectedActions);
    });
  });

  describe('setValue', () => {
    it('sets a value and suggests values', () => {
      const expectedActions = [
        { type: widget1Constants.setValueAction(NAME), value },
        ...widget1Constants.NAMES.map(name => ({
          type: widget1Constants.suggestValueAction(name),
          value: 0,
        })),
      ];

      return expectActions(
        widget1Actions.setValue(NAME, value),
        expectedActions,
      );
    });

    describe('setAuto', () => {
      it('sets a value to auto, and resuggests all values', () => {
        const expectedActions = [
          { type: widget1Constants.setAutoAction(NAME), auto: true },
          ...widget1Constants.NAMES.map(name => ({
            type: widget1Constants.suggestValueAction(name),
            value: 0,
          })),
        ];

        return expectActions(
          widget1Actions.setAuto(NAME, true),
          expectedActions,
        );
      });
    });

    describe('increaseSliderMax', () => {
      it('creates the right action', () => {
        const expectedActions = {
          type: widget1Constants.increaseSliderMaxAction(NAME),
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
        store = prepareStore({ step: widget1Constants.FINAL_STEP });
        const expectedActions = [
          { type: 'step_SET', value: widget1Constants.FINAL_STEP },
          ...widget1Constants.NAMES.map(name => ({
            type: widget1Constants.suggestValueAction(name),
            value: 0,
          })),
        ];
        return expectActions(
          widget1Actions.setStep(widget1Constants.FINAL_STEP),
          expectedActions,
        );
      });
    });
  });

  describe('resetCalculator', () => {
    it('resets all the values', () => {
      const expectedActions = [
        { type: 'salary_CHANGE', value: 0 },
        { type: 'salary_AUTO', auto: true },
        { type: 'fortune_CHANGE', value: 0 },
        { type: 'fortune_AUTO', auto: true },
        { type: 'property_CHANGE', value: 0 },
        { type: 'property_AUTO', auto: true },
      ];
      return expectActions(widget1Actions.resetCalculator(), expectedActions);
    });
  });
});
