/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import { ClientEventService } from '../../../events';
import '../../../events/registerClientListeners';
import { setFileStatus, completeAddAssignedToTask } from '../../../methods';
import {
  notifyAdminOfCompletedTaskOnFileStatusChangedListener,
  notifyAdminOfCompletedTaskOnAdminAssignedToTaskListener,
} from '../../taskListeners';
import TaskNotificationService from '../../TasksNotificationService';

describe('Task Client Listeners', () => {
  describe('notifyAdminOfCompletedTaskOnFileStatusChangedListener', () => {
    it(`listens to \`${setFileStatus.config.name}\` method`, () => {
      const {
        config: { name: methodName },
      } = setFileStatus;
      const listeners = ClientEventService.getListenerFunctions(methodName);
      expect(listeners.includes(notifyAdminOfCompletedTaskOnFileStatusChangedListener)).to.equal(true);
    });

    it('calls `TaskNotificationService.notifyTaskCompletedWhenFileStatusChanged` function with the needed params', () => {
      sinon.stub(
        TaskNotificationService,
        'notifyTaskCompletedWhenFileStatusChanged',
      );
      const listenerParams = {
        fileKey: 'someFileKey',
        newStatus: 'SOME_STATUS',
      };

      expect(TaskNotificationService.notifyTaskCompletedWhenFileStatusChanged.called).to.equal(false);
      notifyAdminOfCompletedTaskOnFileStatusChangedListener(listenerParams);

      expect(TaskNotificationService.notifyTaskCompletedWhenFileStatusChanged.getCall(0).args).to.deep.equal([
        {
          fileKey: 'someFileKey',
          newStatus: 'SOME_STATUS',
        },
      ]);

      TaskNotificationService.notifyTaskCompletedWhenFileStatusChanged.restore();
    });
  });

  describe('notifyAdminOfCompletedTaskOnAdminAssignedToTaskListener', () => {
    it(`listens to \`${completeAddAssignedToTask.config.name}\` method`, () => {
      const {
        config: { name: methodName },
      } = completeAddAssignedToTask;
      const listeners = ClientEventService.getListenerFunctions(methodName);
      expect(listeners.includes(notifyAdminOfCompletedTaskOnAdminAssignedToTaskListener)).to.equal(true);
    });

    it('calls `TaskNotificationService.notifyTaskCompletedWhenAdminAssignedToTask` function with the needed params', () => {
      sinon.stub(
        TaskNotificationService,
        'notifyTaskCompletedWhenAdminAssignedToTask',
      );
      const listenerParams = {
        userId: 'someUserId',
      };

      expect(TaskNotificationService.notifyTaskCompletedWhenAdminAssignedToTask
        .called).to.equal(false);
      notifyAdminOfCompletedTaskOnAdminAssignedToTaskListener(listenerParams);

      expect(TaskNotificationService.notifyTaskCompletedWhenAdminAssignedToTask.getCall(0).args).to.deep.equal([
        {
          userId: 'someUserId',
        },
      ]);

      TaskNotificationService.notifyTaskCompletedWhenAdminAssignedToTask.restore();
    });
  });
});
