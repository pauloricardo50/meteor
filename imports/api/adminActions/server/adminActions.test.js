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
  completeActionByactionType,
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
      actionId = Factory.create('adminAction', { userId, requestId });
      sinon.stub(Meteor, 'userId').callsFake(() => userId);
    });

    afterEach(() => {
      stubCollections.restore();
      Meteor.userId.restore();
    });

    describe('insertAdminAction', () => {
      it('should insert a new admin action without errors', (done) => {
        insertAdminAction.call(
          { requestId: 'test', actionType: 'test' },
          (err, result) => {
            if (err) {
              done(err);
            }

            const action = AdminActions.findOne(result);
            expect(action.requestId).to.equal('test');
            expect(action.actionType).to.equal('test');
            done();
          },
        );
      });

      it('should throw if the action already exists', () => {
        expect(() =>
          insertAdminAction._execute({}, { requestId, actionType: 'test' }),
        ).to.throw(Meteor.Error, 'duplicate active admin action');
      });
    });

    describe('completeActionByactionType', () => {
      it('completes an action', () => {
        //
      });
    });

    describe('removeParentRequest', () => {
      it('completes an action', () => {
        //
      });
    });
  });
});
