// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import {
  rehydrateMiddleware,
  makeSaveDataMiddleware,
} from '../financingStructuresMiddleware';
import { REHYDRATE_LOAN } from '../financingStructuresTypes';

describe('financingStructuresMiddleware', () => {
  describe('rehydrateMiddleware', () => {
    const doDispatch = sinon.spy();
    const doGetState = () => {};
    const nextHandler = rehydrateMiddleware({
      dispatch: doDispatch,
      getState: doGetState,
    });

    beforeEach(() => {
      doDispatch.resetHistory();
    });

    it('must return a function to handle next', () => {
      expect(nextHandler).to.be.a('function');
      expect(nextHandler).to.have.length(1);
    });

    it('lets a random action pass through', (done) => {
      const actionObj = { type: 'yo' };

      const actionHandler = nextHandler((action) => {
        expect(action).to.deep.equal(actionObj);
        done();
      });

      actionHandler(actionObj);
    });

    it('does not let REHYDRATE_LOAN pass through', (done) => {
      const actionObj = {
        type: REHYDRATE_LOAN,
        payload: { loan: { structures: [], borrowers: [], properties: [] } },
      };

      const actionHandler = nextHandler((result) => {
        expect(result).to.equal(undefined);
        done();
      });

      actionHandler(actionObj);
    });

    it('dispatches 4 correct REHYDRATE_DATA actions', (done) => {
      const actionObj = {
        type: REHYDRATE_LOAN,
        payload: {
          loan: {
            structures: [{ id: 1 }],
            borrowers: [{ id: 2 }],
            properties: [{ id: 3 }, { id: 4 }],
          },
        },
      };

      const actionHandler = nextHandler((result) => {
        expect(result).to.equal(undefined);
        expect(doDispatch.callCount).to.equal(4);
        const spyCalls = doDispatch.getCalls();

        expect(spyCalls[0].args[0]).to.deep.equal({
          type: 'REHYDRATE_DATA',
          payload: { dataName: 'loan', data: actionObj.payload.loan },
        });
        expect(spyCalls[1].args[0]).to.deep.equal({
          type: 'REHYDRATE_DATA',
          payload: { dataName: 'structures', data: { 1: { id: 1 } } },
        });
        expect(spyCalls[2].args[0]).to.deep.equal({
          type: 'REHYDRATE_DATA',
          payload: { dataName: 'borrowers', data: { 2: { id: 2 } } },
        });
        expect(spyCalls[3].args[0]).to.deep.equal({
          type: 'REHYDRATE_DATA',
          payload: {
            dataName: 'properties',
            data: { 3: { id: 3 }, 4: { id: 4 } },
          },
        });
        done();
      });

      actionHandler(actionObj);
    });
  });

  describe('saveDataMiddleware', () => {
    let state;
    const doDispatch = sinon.spy();
    const doGetState = () => state;
    const saveDataFunc = sinon.spy();
    const nextHandler = makeSaveDataMiddleware(saveDataFunc)({
      dispatch: doDispatch,
      getState: doGetState,
    });

    beforeEach(() => {
      state = {};
      doDispatch.resetHistory();
    });

    it('must return a function to handle next', () => {
      expect(nextHandler).to.be.a('function');
      expect(nextHandler).to.have.length(1);
    });

    it('lets a random action pass through', (done) => {
      const actionObj = {};
      const actionHandler = nextHandler((result) => {
        expect(result).to.deep.equal({});
        done();
      });

      actionHandler(actionObj);
    });
  });
});
