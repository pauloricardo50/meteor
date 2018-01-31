// FIXME: This fucking test doesn't work because of meteor factory not being able to create a loan

// /* eslint-env mocha */
// import { Meteor } from 'meteor/meteor';
// import { expect } from 'chai';
// import { Factory } from 'meteor/dburles:factory';
// import { stubCollections } from  'core/utils/testHelpers';
// import sinon from 'sinon';
// import { resetDatabase } from 'meteor/xolvio:cleaner';
//
// import AdminActions from '../adminActions';
//
// import {
//   insertAdminAction,
//   completeAction,
//   completeActionByType,
//   removeParentLoan,
// } from '../methods';
//
// describe('AdminActions', () => {
//   describe('methods', () => {
//     let userId;
//     let actionId;
//     let loanId;
//
//     beforeEach(() => {
//       resetDatabase();
//       stubCollections();
//

//       // FIXME: This part is shit
//       userId = Factory.create('user')._id;
//       console.log(userId);
//       const req = Factory.create('loan', { userId });
//       loanId = req._id;
//       console.log(req);
//       // loanId = Factory.create('loan', { userId })._id;
//       console.log(loanId);
//       actionId = Factory.create('adminAction', { userId, loanId })._id;
//       console.log(actionId);
//
//       sinon.stub(Meteor, 'userId').callsFake(() => userId);
//     });
//
//     afterEach(() => {
//       stubCollections.restore();
//       Meteor.userId.restore();
//     });
//
//     describe('insertAdminAction', () => {
//       it('should insert a new admin action without errors', (done) => {
//         insertAdminAction.call(
//           { loanId: 'test', type: 'test' },
//           (err, result) => {
//             if (err) {
//               done(err);
//             }
//
//             const action = AdminActions.findOne(result);
//             expect(action.loanId).to.equal('test');
//             expect(action.type).to.equal('test');
//             done();
//           },
//         );
//       });
//
//       it('should throw if the action already exists', () => {
//         expect(() =>
//           insertAdminAction._execute({}, { loanId, type: 'test' })).to.throw(Meteor.Error, 'duplicate active admin action');
//       });
//     });
//
//     describe('completeAction', () => {
//       it('changes the status of a an action to completed and adds a date', () => {
//         let action = AdminActions.findOne(actionId);
//         expect(action.status).to.equal('active');
//         expect(action.completedAt).to.equal(undefined);
//
//         completeAction._execute({}, { id: actionId });
//
//         action = AdminActions.findOne(actionId);
//         expect(action.status).to.equal('completed');
//         expect(action.completedAt instanceof Date).to.equal(true);
//       });
//
//       it('throws if the action is already completed', () => {
//         const action = Factory.create('adminAction', {
//           status: 'completed',
//           userId,
//         });
//
//         expect(() => completeAction._execute({}, { id: action._id })).to.throw(
//           Meteor.Error,
//           'action is already completed',
//         );
//       });
//     });
//
//     describe('completeActionByType', () => {
//       it('completes an action', () => {
//         completeActionByType._execute({}, { loanId, type: 'test' });
//
//         const action = AdminActions.findOne(actionId);
//         expect(action.type).to.equal('test');
//         expect(action.status).to.equal('completed');
//       });
//
//       it('can take another custom newStatus', () => {
//         const newStatus = 'this is a new status';
//         completeActionByType._execute(
//           {},
//           { loanId, type: 'test', newStatus },
//         );
//
//         const action = AdminActions.findOne(actionId);
//         expect(action.type).to.equal('test');
//         expect(action.status).to.equal(newStatus);
//       });
//     });
//
//     describe('removeParentLoan', () => {
//       it('sets the status of an adminaction to parentDeleted', () => {
//         removeParentLoan._execute({}, { loanId });
//
//         const action = AdminActions.findOne(actionId);
//         expect(action.loanId).to.equal(loanId);
//         expect(action.status).to.equal('parentDeleted');
//       });
//
//       it('works if multiple actions exist with mongoDBs multi', () => {
//         const actionId2 = Factory.create('adminAction', {
//           loanId,
//           type: 'test2',
//         })._id;
//
//         removeParentLoan._execute({}, { loanId });
//
//         const action = AdminActions.findOne(actionId);
//         const action2 = AdminActions.findOne(actionId2);
//         expect(action.loanId).to.equal(loanId);
//         expect(action.status).to.equal('parentDeleted');
//         expect(action2.loanId).to.equal(loanId);
//         expect(action2.status).to.equal('parentDeleted');
//       });
//     });
//   });
// });
