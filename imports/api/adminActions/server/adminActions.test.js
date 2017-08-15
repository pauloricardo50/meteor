/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import { stubCollections } from '/imports/js/helpers/testHelpers';
import sinon from 'sinon';

import AdminActions from '../adminActions';

import {
  insertAdminAction,
  completeAction,
  completeActionByType,
  removeParentRequest,
} from '../methods';

describe('AdminActions', () => {
  describe('methods', () => {
    let userId;
    let actionId;
    let requestId;

    beforeEach(() => {
      stubCollections();
      userId = Factory.create('user')._id;
      requestId = Factory.create('loanRequest', { userId })._id;
      actionId = Factory.create('adminAction', { userId, requestId })._id;
      sinon.stub(Meteor, 'userId').callsFake(() => userId);
    });

    afterEach(() => {
      stubCollections.restore();
      Meteor.userId.restore();
    });

    describe('insertAdminAction', () => {
      it('should insert a new admin action without errors', (done) => {
        insertAdminAction.call(
          { requestId: 'test', type: 'test' },
          (err, result) => {
            if (err) {
              done(err);
            }

            const action = AdminActions.findOne(result);
            expect(action.requestId).to.equal('test');
            expect(action.type).to.equal('test');
            done();
          },
        );
      });

      it('should throw if the action already exists', () => {
        expect(() =>
          insertAdminAction._execute({}, { requestId, type: 'test' }),
        ).to.throw(Meteor.Error, 'duplicate active admin action');
      });
    });

    describe('completeAction', () => {
      it('changes the status of a an action to completed and adds a date', () => {
        let action = AdminActions.findOne(actionId);
        expect(action.status).to.equal('active');
        expect(action.completedAt).to.equal(undefined);

        completeAction._execute({}, { id: actionId });

        action = AdminActions.findOne(actionId);
        expect(action.status).to.equal('completed');
        expect(action.completedAt instanceof Date).to.equal(true);
      });

      it('throws if the action is already completed', () => {
        const action = Factory.create('adminAction', {
          status: 'completed',
          userId,
        });

        expect(() => completeAction._execute({}, { id: action._id })).to.throw(
          Meteor.Error,
          'action is already completed',
        );
      });
    });

    describe('completeActionByType', () => {
      it('completes an action', () => {
        completeActionByType._execute({}, { requestId, type: 'test' });

        const action = AdminActions.findOne(actionId);
        expect(action.type).to.equal('test');
        expect(action.status).to.equal('completed');
      });

      it('can take another custom newStatus', () => {
        const newStatus = 'this is a new status';
        completeActionByType._execute(
          {},
          { requestId, type: 'test', newStatus },
        );

        const action = AdminActions.findOne(actionId);
        expect(action.type).to.equal('test');
        expect(action.status).to.equal(newStatus);
      });
    });

    describe('removeParentRequest', () => {
      it('sets the status of an adminaction to parentDeleted', () => {
        removeParentRequest._execute({}, { requestId });

        const action = AdminActions.findOne(actionId);
        expect(action.requestId).to.equal(requestId);
        expect(action.status).to.equal('parentDeleted');
      });

      it('works if multiple actions exist with mongoDBs multi', () => {
        const actionId2 = Factory.create('adminAction', {
          requestId,
          type: 'test2',
        })._id;

        removeParentRequest._execute({}, { requestId });

        const action = AdminActions.findOne(actionId);
        const action2 = AdminActions.findOne(actionId2);
        expect(action.requestId).to.equal(requestId);
        expect(action.status).to.equal('parentDeleted');
        expect(action2.requestId).to.equal(requestId);
        expect(action2.status).to.equal('parentDeleted');
      });
    });
  });
});
