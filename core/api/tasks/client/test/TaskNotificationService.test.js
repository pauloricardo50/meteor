/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import sinon from 'sinon';
import { Factory } from 'meteor/dburles:factory';
import { stubCollections } from 'core/utils/testHelpers';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Bert } from 'meteor/themeteorchef:bert';

import TasksNotificationService from '../../TasksNotificationService';
import { TASK_STATUS, FILE_STATUS } from '../../../constants';

let completedTask;

describe('Task Client Service', () => {
  describe('Methods that query data', () => {
    beforeEach(() => {
      stubCollections();
      resetDatabase();
      sinon.stub(TasksNotificationService, 'notifyAdminOfCompletedTask');

      completedTask = Factory.create('task', { status: TASK_STATUS.COMPLETED });
    });

    afterEach(() => {
      stubCollections.restore();
      TasksNotificationService.notifyAdminOfCompletedTask.restore();
    });

    describe('notifyTaskCompletedWhenFileStatusChanged', () => {
      // TODO
      it('calls `TaskNotificationService.notifyAdminOfCompletedTask` on the correct task', async () => {
        expect(TasksNotificationService.notifyAdminOfCompletedTask.called).to.equal(false);
        await TasksNotificationService.notifyTaskCompletedWhenFileStatusChanged({
          fileKey: completedTask.fileKey,
          newStatus: FILE_STATUS.VALID,
        });
        expect(TasksNotificationService.notifyAdminOfCompletedTask.getCall(0).args).to.deep.equal([{ task: completedTask }]);
      });

      // check it actually fails, after the above test is working
      it(`does not call \`TaskNotificationService.notifyAdminOfCompletedTask\` when file status none of \`${
        FILE_STATUS.ERROR
      }\` or \`${FILE_STATUS.VALID}\``, async () => {
        await TasksNotificationService.notifyTaskCompletedWhenFileStatusChanged({
          fileKey: completedTask.fileKey,
          newStatus: FILE_STATUS.UNVERIFIED,
        });
        expect(TasksNotificationService.notifyAdminOfCompletedTask.called).to.equal(false);
      });
    });

    describe('notifyTaskCompletedWhenAdminAssigned', () => {
      // TODO
      it('calls `TaskNotificationService.notifyAdminOfCompletedTask` on the correct task');

      // check it actually fails, after the above test is working
      it('does not call `TaskNotificationService.notifyAdminOfCompletedTask` when `userId` is undefined', async () => {
        await TasksNotificationService.notifyTaskCompletedWhenFileStatusChanged({
          userId: undefined,
        });
        expect(TasksNotificationService.notifyAdminOfCompletedTask.called).to.equal(false);
      });
    });
  });

  describe('notifyAdminOfCompletedTask', () => {
    beforeEach(() => {
      sinon.stub(Bert, 'alert');
    });

    afterEach(() => {
      Bert.alert.restore();
    });

    it('triggers a bert alert', () => {
      const task = { _id: 'aTaskId', status: TASK_STATUS.COMPLETED };

      expect(Bert.alert.called).to.equal(false);
      TasksNotificationService.notifyAdminOfCompletedTask({ task });
      expect(Bert.alert.getCall(0).args).to.deep.equal([
        {
          title: 'Success!',
          message: 'The task "aTaskId" has been completed',
          type: 'success',
          style: 'fixed-top',
        },
      ]);
    });

    // check
    it('does not trigger a bert alert for an undefined task', () => {
      expect(Bert.alert.called).to.equal(false);
      TasksNotificationService.notifyAdminOfCompletedTask({
        task: undefined,
      });
      expect(Bert.alert.called).to.equal(false);
    });
  });
});
