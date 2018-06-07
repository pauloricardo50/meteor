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
  beforeEach(() => {
    stubCollections();
    resetDatabase();

    const admin = Factory.create('admin');

    sinon.stub(Meteor, 'userId').callsFake(() => admin._id);
    sinon.stub(Meteor, 'user').callsFake(() => admin);

    sinon.stub(Bert, 'alert');

    completedTask = Factory.create('task', { status: TASK_STATUS.COMPLETED });
  });

  afterEach(() => {
    Bert.alert.restore();
    stubCollections.restore();
    Meteor.user.restore();
    Meteor.userId.restore();
  });

  describe('notifyTaskCompletedWhenFileStatusChanged', () => {
    beforeEach(() => {
      sinon.stub(TasksNotificationService, 'notifyAdminOfCompletedTask');
    });

    afterEach(() => {
      TasksNotificationService.notifyAdminOfCompletedTask.restore();
    });

    it.skip('calls `TaskNotificationService.notifyAdminOfCompletedTask` on the correct task', () => {
      expect(TasksNotificationService.notifyAdminOfCompletedTask.called).to.equal(false);
      TasksNotificationService.notifyTaskCompletedWhenFileStatusChanged({
        fileKey: completedTask.fileKey,
        newStatus: FILE_STATUS.VALID,
      });
      expect(TasksNotificationService.notifyAdminOfCompletedTask.getCall(0).args).to.deep.equal([{ task: completedTask }]);
    });

    it.skip("does not call `TaskNotificationService.notifyAdminOfCompletedTask` when file status isn't error or valid", () => {
      TasksNotificationService.notifyTaskCompletedWhenFileStatusChanged({
        fileKey: completedTask.fileKey,
        newStatus: FILE_STATUS.UNVERIFIED,
      });
      expect(TasksNotificationService.notifyAdminOfCompletedTask.called).to.equal(false);
    });

    it.skip('does not call `TaskNotificationService.notifyAdminOfCompletedTask` when file-related task not completed', () => {
      const activeTask = Factory.create('task', {
        status: TASK_STATUS.ACTIVE,
      });

      TasksNotificationService.notifyTaskCompletedWhenFileStatusChanged({
        fileKey: activeTask.fileKey,
        newStatus: FILE_STATUS.VALID,
      });

      expect(TasksNotificationService.notifyAdminOfCompletedTask.called).to.equal(false);
    });
  });

  describe('notifyAdminOfCompletedTask', () => {
    it('triggers a bert alert', () => {
      const task = { _id: 'aTaskId', status: TASK_STATUS.COMPLETED };

      expect(Bert.alert.called).to.equal(false);
      TasksNotificationService.notifyAdminOfCompletedTask({ task });
      expect(Bert.alert.getCall(0).args).to.deep.equal([
        {
          title: 'Success!',
          message: 'The task aTaskId has been completed',
          type: 'success',
          style: 'fixed-top',
        },
      ]);
    });
  });
});
