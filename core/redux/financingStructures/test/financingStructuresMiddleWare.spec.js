// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import {
  rehydrateMiddleware,
  makeSaveDataMiddleware,
  DEBOUNCE_TIMEOUT_MS,
} from '../financingStructuresMiddleware';
import { REHYDRATE_LOAN, UPDATE_STRUCTURE } from '../financingStructuresTypes';

describe('financingStructuresMiddleware', () => {
  describe('rehydrateMiddleware', () => {
    const doDispatch = sinon.spy();
    const doGetState = () => ({ financingStructures: {} });
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

    it('does not let REHYDRATE_LOAN pass through', () => {
      const actionObj = {
        type: REHYDRATE_LOAN,
        payload: { loan: { structures: [], borrowers: [], properties: [] } },
      };

      const actionHandler = nextHandler(action => action);
      const actionHandlerReturn = actionHandler(actionObj);

      expect(actionHandlerReturn).to.equal(undefined);
    });

    it('dispatches 4 correct REHYDRATE_DATA actions', () => {
      const actionObj = {
        type: REHYDRATE_LOAN,
        payload: {
          loan: {
            structures: [{ id: 1 }],
            borrowers: [{ id: 2 }],
            properties: [{ id: 3 }],
          },
        },
      };

      const actionHandler = nextHandler(action => action);
      const actionHandlerReturn = actionHandler(actionObj);

      expect(actionHandlerReturn).to.equal(undefined);

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
          data: { 3: { id: 3 } },
        },
      });
    });
  });

  describe('saveDataMiddleware', () => {
    let state;
    const aStructure = { id: 'a', data: 'stuff' };
    const doDispatch = sinon.spy();
    const doGetState = () => state;
    const saveDataFunc = sinon.spy();
    const nextHandler = makeSaveDataMiddleware(saveDataFunc)({
      dispatch: doDispatch,
      getState: doGetState,
    });

    beforeEach(() => {
      state = {
        financingStructures: {
          loan: { _id: 'test' },
          structures: { a: aStructure },
        },
      };
      doDispatch.resetHistory();
      saveDataFunc.resetHistory();
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

    it('lets UPDATE_STRUCTURE pass through', (done) => {
      const actionObj = { type: UPDATE_STRUCTURE, payload: {} };
      const actionHandler = nextHandler((result) => {
        expect(result).to.deep.equal(actionObj);
        done();
      });

      actionHandler(actionObj);
    });

    it('calls saveDataFunc with the right arguments', (done) => {
      const actionHandler = nextHandler(x => x);

      actionHandler({ type: UPDATE_STRUCTURE, payload: { structureId: 'a' } });
      setTimeout(() => {
        expect(saveDataFunc.calledWith({
          loanId: 'test',
          structureId: 'a',
          structure: aStructure,
        })).to.equal(true);

        done();
      }, 600);
    });

    it('calls the saveDataFunc once if the same structure is updated twice in a row', (done) => {
      const actionHandler = nextHandler(x => x);

      actionHandler({ type: UPDATE_STRUCTURE, payload: { structureId: 'a' } });
      actionHandler({ type: UPDATE_STRUCTURE, payload: { structureId: 'a' } });
      const timeout = setTimeout(() => {
        expect(saveDataFunc.callCount).to.equal(1);
        clearTimeout(timeout);
        done();
      }, 600);
    });

    it('calls the saveDataFunc again after debounce is over', (done) => {
      const actionHandler = nextHandler(x => x);

      actionHandler({ type: UPDATE_STRUCTURE, payload: { structureId: 'a' } });
      actionHandler({ type: UPDATE_STRUCTURE, payload: { structureId: 'b' } });

      setTimeout(() => {
        expect(saveDataFunc.callCount).to.equal(2);
        actionHandler({
          type: UPDATE_STRUCTURE,
          payload: { structureId: 'c' },
        });

        setTimeout(() => {
          expect(saveDataFunc.callCount).to.equal(3);
          const spyCalls = saveDataFunc.getCalls();

          expect(spyCalls[0].args[0].structureId).to.equal('a');
          expect(spyCalls[1].args[0].structureId).to.equal('b');
          expect(spyCalls[2].args[0].structureId).to.equal('c');
          done();
        }, 600);
      }, 600);
    });
  });
});
