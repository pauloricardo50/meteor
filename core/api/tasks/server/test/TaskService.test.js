/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';
import { Factory } from 'meteor/dburles:factory';

import { resetDatabase } from 'meteor/xolvio:cleaner';
import { stubCollections, generateData } from '../../../../utils/testHelpers';
import TaskService from '../../TaskService';
import Tasks from '../../tasks';
import { TASK_STATUS } from '../../taskConstants';

let userId;
let adminId;
let loanId;
let borrowerId;

describe('TaskService', () => {
  beforeEach(() => {
    resetDatabase();
    stubCollections();

    const { user, admin, loan, borrowers } = generateData({
      loan: { user: { assignedEmployeeId: 'anEmployeeId' } },
    });
    userId = user._id;
    adminId = admin._id;
    loanId = loan._id;
    borrowerId = borrowers[0]._id;

    [userId, adminId, loanId, borrowerId].forEach((id) => {
      expect(id).to.be.a('string');
    });
  });

  afterEach(() => {
    stubCollections.restore();
  });

  describe('insert', () => {
    describe('file related tasks', () => {
      it('inserts a Task with the necessary file data in it', () => {
        const insertParams = {
          type: 'USER_ADDED_FILE',
          loanId,
          documentId: 'someDocumentId',
          fileKey: 'someFileKey',
          userId,
        };

        expect(Tasks.findOne(insertParams)).to.equal(undefined);
        TaskService.insert(insertParams);
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

        expect(Tasks.find(insertParams).count()).to.equal(0);
        TaskService.insert(insertParams);
        expect(Tasks.find(insertParams).count()).to.equal(1);

        Tasks.update(insertParams, { $set: { status: TASK_STATUS.ACTIVE } });

        expect(() => TaskService.insert(insertParams)).to.throw(/duplicate active task/);
        expect(Tasks.find(insertParams).count()).to.equal(1);
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

    it(`calls 'TaskService.insert' in order to add
        a task of type 'USER_ADDED_FILE'`, () => {
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

    it(`does not call 'TaskService.insert'
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

  describe('completeFileTask', () => {
    beforeEach(() => {
      sinon.stub(TaskService, 'complete');
    });

    afterEach(() => {
      TaskService.complete.restore();
    });

    it(`calls 'TaskService.complete'
        with the correct file-related task id when task is active`, () => {
      expect(TaskService.complete.called).to.equal(false);

      const task = Factory.create('task', { status: TASK_STATUS.ACTIVE });

      TaskService.completeFileTask({
        collection: 'borrowers',
        docId: task.borrowerId,
        documentId: task.documentId,
        fileKey: task.fileKey,
      });

      expect(TaskService.complete.getCall(0).args).to.deep.equal([
        { taskId: task._id },
      ]);
    });

    it(`does not call 'TaskService.complete'
        when the file-related task isn't active`, () => {
      const task = Factory.create('task', { status: TASK_STATUS.COMPLETED });

      TaskService.completeFileTask({
        collection: 'borrowers',
        docId: task.borrowerId,
        documentId: task.documentId,
        fileKey: task.fileKey,
      });

      expect(TaskService.complete.called).to.equal(false);
    });

    it(`does not call 'TaskService.complete'
        when file-related task cannot be found`, () => {
      TaskService.completeFileTask({
        collection: 'borrowers',
        docId: 'nonExistentBorrowerId',
        documentId: 'identity',
        fileKey: 'asdf/fakeKey/fakeFile.pdf',
      });
      expect(TaskService.complete.called).to.equal(false);
    });
  });
});
