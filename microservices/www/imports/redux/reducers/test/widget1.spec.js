/* eslint-env mocha */
import { expect } from 'chai';

import widget1, {
  NAMES,
  PROPERTY,
  createWidget1ValueReducers,
  setValueAction,
  suggestValueAction,
  setAutoAction,
  increaseSliderMaxAction,
} from '../widget1';

describe('widget1 Reducer', () => {
  it('should return the initial state', () => {
    expect(widget1()).to.deep.equal({
      ...NAMES.reduce(
        (acc, name) => ({
          ...acc,
          [name]: {
            value: 0,
            auto: false,
            sliderMax: name === PROPERTY ? 2000000 : 500000,
          },
        }),
        {},
      ),
      step: 0,
      interestRate: 0.015,
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
        expect(reducer({}, { type: setValueAction(TEST), value })).to.deep.equal({
          value,
          auto: false,
        });
      });

      it('It should set auto to true and value to 0 if the value is set to 0 or falsy', () => {
        let value = 0;
        expect(reducer({}, { type: setValueAction(TEST), value })).to.deep.equal({
          value: 0,
          auto: true,
        });
        value = undefined;
        expect(reducer({}, { type: setValueAction(TEST), value })).to.deep.equal({
          value: 0,
          auto: true,
        });
        value = false;
        expect(reducer({}, { type: setValueAction(TEST), value })).to.deep.equal({
          value: 0,
          auto: true,
        });
      });

      it('should allow the value to be an empty string, so that the user can keep typing', () => {
        const value = '';
        expect(reducer({}, { type: setValueAction(TEST), value })).to.deep.equal({
          value,
          auto: false,
        });
      });

      it('rounds the value that is set', () => {
        const value = 100.2;
        expect(reducer({}, { type: setValueAction(TEST), value })).to.deep.equal({
          value: 100,
          auto: false,
        });
      });
    });

    describe('suggestValue action', () => {
      it('sets the value without changing auto', () => {
        const value = 100;
        let auto = true;
        expect(reducer({ auto }, { type: suggestValueAction(TEST), value })).to.deep.equal({
          value,
          auto,
        });

        auto = false;
        expect(reducer({ auto }, { type: suggestValueAction(TEST), value })).to.deep.equal({
          value,
          auto,
        });
      });
    });

    describe('setAuto action', () => {
      it('sets auto', () => {
        let auto = true;
        expect(reducer({}, { type: setAutoAction(TEST), auto })).to.deep.equal({
          auto,
        });
        auto = false;
        expect(reducer({}, { type: setAutoAction(TEST), auto })).to.deep.equal({
          auto,
        });
      });

      it('toggles auto if no value is provided', () => {
        let auto = true;
        expect(reducer({ auto }, { type: setAutoAction(TEST) })).to.deep.equal({
          auto: !auto,
        });
        auto = false;
        expect(reducer({ auto }, { type: setAutoAction(TEST) })).to.deep.equal({
          auto: !auto,
        });
      });
    });

    describe('increaseSliderMax action', () => {
      it('doubles sliderMax', () => {
        expect(reducer({ sliderMax: 50 }, { type: increaseSliderMaxAction(TEST) })).to.deep.equal({
          sliderMax: 2 * 50,
        });
      });

      it('prevents a user from going above 100M', () => {
        expect(reducer(
          { sliderMax: 50000001 },
          { type: increaseSliderMaxAction(TEST) },
        )).to.deep.equal({ sliderMax: 100000000 });
      });
    });
  });
});
