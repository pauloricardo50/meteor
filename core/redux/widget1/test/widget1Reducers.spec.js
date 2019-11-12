/* eslint-env mocha */
import { expect } from 'chai';

import widget1, { createWidget1ValueReducers } from '../widget1Reducers';
import {
  SET_VALUE,
  SUGGEST_VALUE,
  SET_AUTO,
  INCREASE_SLIDER_MAX,
  SET_ALLOW_EXTREME_LOAN,
} from '../widget1Types';

import { ALL_FIELDS, SALARY, FORTUNE, CURRENT_LOAN } from '../widget1Constants';

describe('widget1 Reducer', () => {
  it('should return the initial state', () => {
    expect(widget1()).to.deep.equal({
      ...ALL_FIELDS.reduce(
        (acc, name) => ({
          ...acc,
          [name]: {
            value: 0,
            auto: false,
            sliderMax: name === SALARY || name === FORTUNE ? 500000 : 2000000,
          },
        }),
        {},
      ),
      step: 0,
      interestRate: 0.015,
      purchaseType: 'ACQUISITION',
      finishedTutorial: false,
      useMaintenance: true,
    });
  });

  describe('widget1 value reducer', () => {
    const initialSliderMax = 10;
    const TEST = 'TEST';
    const reducer = createWidget1ValueReducers([
      { name: TEST, initialSliderMax },
    ])[TEST];
    const initialState = {
      value: 0,
      auto: false,
      sliderMax: initialSliderMax,
    };

    it('should return the initial state', () => {
      expect(reducer(undefined, {})).to.deep.equal(initialState);
    });

    describe('setValue action', () => {
      it('should handle setValue and put auto to false', () => {
        const value = 100;
        expect(reducer({}, { type: SET_VALUE(TEST), value })).to.deep.equal({
          value,
          auto: false,
        });
      });

      it('It should set auto to true and value to 0 if the value is set to 0 or falsy', () => {
        let value = 0;
        expect(reducer({}, { type: SET_VALUE(TEST), value })).to.deep.equal({
          value: 0,
          auto: true,
        });
        value = undefined;
        expect(reducer({}, { type: SET_VALUE(TEST), value })).to.deep.equal({
          value: 0,
          auto: true,
        });
        value = false;
        expect(reducer({}, { type: SET_VALUE(TEST), value })).to.deep.equal({
          value: 0,
          auto: true,
        });
      });

      it('should not set auto to true for CURRENT_LOAN if it is set to 0', () => {
        const currentLoanReducer = createWidget1ValueReducers([
          { name: CURRENT_LOAN, initialSliderMax },
        ])[CURRENT_LOAN];
        const value = 0;
        expect(
          currentLoanReducer({}, { type: SET_VALUE(CURRENT_LOAN), value }),
        ).to.deep.equal({
          value: 0,
          auto: false,
        });
      });

      it('should allow the value to be an empty string, so that the user can keep typing', () => {
        const value = '';
        expect(reducer({}, { type: SET_VALUE(TEST), value })).to.deep.equal({
          value,
          auto: false,
        });
      });

      it('rounds the value that is set', () => {
        const value = 100.2;
        expect(reducer({}, { type: SET_VALUE(TEST), value })).to.deep.equal({
          value: 100,
          auto: false,
        });
      });
    });

    describe('suggestValue action', () => {
      it('sets the value without changing auto', () => {
        const value = 100;
        let auto = true;
        expect(
          reducer({ auto }, { type: SUGGEST_VALUE(TEST), value }),
        ).to.deep.equal({
          value,
          auto,
        });

        auto = false;
        expect(
          reducer({ auto }, { type: SUGGEST_VALUE(TEST), value }),
        ).to.deep.equal({
          value,
          auto,
        });
      });
    });

    describe('setAuto action', () => {
      it('sets auto', () => {
        let auto = true;
        expect(reducer({}, { type: SET_AUTO(TEST), auto })).to.deep.equal({
          auto,
        });
        auto = false;
        expect(reducer({}, { type: SET_AUTO(TEST), auto })).to.deep.equal({
          auto,
        });
      });

      it('toggles auto if no value is provided', () => {
        let auto = true;
        expect(reducer({ auto }, { type: SET_AUTO(TEST) })).to.deep.equal({
          auto: !auto,
        });
        auto = false;
        expect(reducer({ auto }, { type: SET_AUTO(TEST) })).to.deep.equal({
          auto: !auto,
        });
      });
    });

    describe('increaseSliderMax action', () => {
      it('doubles sliderMax', () => {
        expect(
          reducer({ sliderMax: 50 }, { type: INCREASE_SLIDER_MAX(TEST) }),
        ).to.deep.equal({
          sliderMax: 2 * 50,
        });
      });

      it('prevents a user from going above 100M', () => {
        expect(
          reducer({ sliderMax: 50000001 }, { type: INCREASE_SLIDER_MAX(TEST) }),
        ).to.deep.equal({ sliderMax: 100000000 });
      });
    });

    describe('setAllowExtremeLoan action', () => {
      it('sets allowExtremeLoan to true', () => {
        expect(
          reducer({}, { type: SET_ALLOW_EXTREME_LOAN(TEST) }),
        ).to.deep.equal({
          allowExtremeLoan: true,
        });
      });
    });
  });
});
