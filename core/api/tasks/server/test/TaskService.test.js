/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import { resetDatabase } from 'meteor/xolvio:cleaner';
import { stubCollections, generateData } from '../../../../utils/testHelpers';
import TaskService from '../../TaskService';
import Tasks from '../../tasks';
import { TASK_STATUS } from '../../taskConstants';

let userId;
let adminId;
let loanId;

describe.only('TaskService', () => {
  beforeEach(() => {
    resetDatabase();
    stubCollections();

    const { user, admin, loan } = generateData({
      loan: { user: { assignedEmployeeId: 'anEmployeeId' } },
    });
    userId = user._id;
    adminId = admin._id;
    loanId = loan._id;

    expect(userId).to.be.a('string');
    expect(adminId).to.be.a('string');
    expect(loanId).to.be.a('string');
  });

  afterEach(() => {
    stubCollections.restore();
  });

  describe('insert', () => {
    describe('file related tasks', () => {
      it('inserts a Task with the necessary file data in it', () => {
        expect(Tasks.find().count()).to.equal(0);

        const insertParams = {
          type: 'USER_ADDED_FILE',
          loanId,
          documentId: 'someDocumentId',
          fileKey: 'someFileKey',
          userId,
        };
        TaskService.insert(insertParams);

        expect(Tasks.find().count()).to.equal(1);
        expect(Tasks.findOne(insertParams)).to.deep.include(insertParams);
      });

      it('prevents duplicate creation of 2 active task', () => {
        const insertParams = {
          type: 'USER_ADDED_FILE',
          loanId,
          documentId: 'someDocumentId',
          fileKey: 'someFileKey',
          userId,
        };

        expect(Tasks.find().count()).to.equal(0);
        TaskService.insert(insertParams);
        expect(Tasks.find().count()).to.equal(1);

        Tasks.update(insertParams, { $set: { status: TASK_STATUS.ACTIVE } });

        expect(() => TaskService.insert(insertParams)).to.throw(/duplicate active task/);

        expect(Tasks.find().count()).to.equal(1);
      });

      it('inserts multiple active tasks that have only the file key different', () => {
        const insertParams1 = {
          type: 'USER_ADDED_FILE',
          loanId,
          documentId: 'someDocumentId',
          fileKey: 'someFileKey1',
          userId,
        };

        const task1Id = TaskService.insert(insertParams1);
        expect(Tasks.findOne(task1Id)).to.deep.include(insertParams1);

        Tasks.update(task1Id, { $set: { status: TASK_STATUS.ACTIVE } });

        const insertParams2 = { ...insertParams1, fileKey: 'someFileKey2' };
        const task2Id = TaskService.insert(insertParams2);
        expect(Tasks.findOne(task2Id)).to.deep.include(insertParams2);
      });
    });
  });

  describe('insertTaskForAddedFile', () => {
    beforeEach(() => {
      sinon.stub(TaskService, 'insert');
    });

    afterEach(() => {
      TaskService.insert.restore();
    });

    it(`calls \`TaskService.insert\` in order to add
        a task of type \`USER_ADDED_FILE\``, () => {
      expect(TaskService.insert.called).to.equal(false);

      TaskService.insertTaskForAddedFile({
        collection: 'loans',
        docId: 'someLoanId',
        userId,
        documentId: 'someDocumentId',
        fileKey: 'someFileKey',
      });

      expect(TaskService.insert.getCall(0).args).to.deep.equal([
        {
          type: 'USER_ADDED_FILE',
          loanId: 'someLoanId',
          userId,
          documentId: 'someDocumentId',
          fileKey: 'someFileKey',
        },
      ]);
    });

    it(`does not call \`TaskService.insert\`
        when task was added by a non-user`, () => {
      expect(TaskService.insert.called).to.equal(false);

      TaskService.insertTaskForAddedFile({
        collection: 'loans',
        docId: 'someLoanId',
        userId: adminId,
        documentId: 'someDocumentId',
        fileKey: 'someFileKey',
      });

      expect(TaskService.insert.called).to.equal(false);
    });
  });
});
