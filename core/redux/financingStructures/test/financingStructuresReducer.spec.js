/* eslint-env mocha */
import { expect } from 'chai';

import financingStructuresReducer from '../financingStructuresReducer';
import { REHYDRATE_DATA, UPDATE_STRUCTURE } from '../financingStructuresTypes';

describe('financingStructuresReducer', () => {
  describe('REHYDRATE_DATA', () => {
    it('loads data into the reducer', () => {
      const action = {
        type: REHYDRATE_DATA,
        payload: { data: 'world', dataName: 'hello' },
      };
      expect(financingStructuresReducer(null, action)).to.deep.equal({
        hello: 'world',
      });
    });

    it('overrides previous data', () => {
      const state = { hello: 'yo' };
      const action = {
        type: REHYDRATE_DATA,
        payload: { data: 'world', dataName: 'hello' },
      };
      expect(financingStructuresReducer(state, action)).to.deep.equal({
        hello: 'world',
      });
    });
  });

  describe('UPDATE_STRUCTURE', () => {
    it('updates a partial structure', () => {
      const state = { structures: { 1: { hello: 'world' } } };
      const action = {
        type: UPDATE_STRUCTURE,
        payload: { structureId: 1, structure: { hello2: 'world2' } },
      };
      expect(financingStructuresReducer(state, action)).to.deep.equal({
        structures: {
          1: {
            hello: 'world',
            hello2: 'world2',
          },
        },
      });
    });

    it('overrides structure data', () => {
      const state = { structures: { 1: { hello: 'world' } } };
      const action = {
        type: UPDATE_STRUCTURE,
        payload: { structureId: 1, structure: { hello: 'world2' } },
      };
      expect(financingStructuresReducer(state, action)).to.deep.equal({
        structures: {
          1: {
            hello: 'world2',
          },
        },
      });
    });
  });
});
