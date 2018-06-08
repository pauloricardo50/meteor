/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import { ClientEventService } from '../../../events';
import '../../../events/registerClientListeners';
import { setFileStatus, completeAddAssignedToTask } from '../../../methods';
import {
  fileStatusChangedCompletedTaskNotificationListener,
  addAssignedToCompletedTaskNotificationListener,
} from '../../taskListeners';
import TaskNotificationService from '../../TasksNotificationService';

describe('Task Client Listeners', () => {
  describe('fileStatusChangedCompletedTaskNotificationListener', () => {
    it(`listens to \`${setFileStatus.config.name}\` method`, () => {
      const {
        config: { name: methodName },
      } = setFileStatus;
      const listeners = ClientEventService.getListenerFunctions(methodName);
      expect(listeners.includes(fileStatusChangedCompletedTaskNotificationListener)).to.equal(true);
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
      fileStatusChangedCompletedTaskNotificationListener(listenerParams);

      expect(TaskNotificationService.notifyTaskCompletedWhenFileStatusChanged.getCall(0).args).to.deep.equal([
        {
          fileKey: 'someFileKey',
          newStatus: 'SOME_STATUS',
        },
      ]);

      TaskNotificationService.notifyTaskCompletedWhenFileStatusChanged.restore();
    });
  });

  describe('addAssignedToCompletedTaskNotificationListener', () => {
    it(`listens to \`${completeAddAssignedToTask.config.name}\` method`, () => {
      const {
        config: { name: methodName },
      } = completeAddAssignedToTask;
      const listeners = ClientEventService.getListenerFunctions(methodName);
      expect(listeners.includes(addAssignedToCompletedTaskNotificationListener)).to.equal(true);
    });

    it('calls `TaskNotificationService.notifyTaskCompletedWhenAddedAssignedAdmin` function with the needed params', () => {
      sinon.stub(
        TaskNotificationService,
        'notifyTaskCompletedWhenAddedAssignedAdmin',
      );
      const listenerParams = {
        userId: 'someUserId',
      };

      expect(TaskNotificationService.notifyTaskCompletedWhenAddedAssignedAdmin
        .called).to.equal(false);
      addAssignedToCompletedTaskNotificationListener(listenerParams);

      expect(TaskNotificationService.notifyTaskCompletedWhenAddedAssignedAdmin.getCall(0).args).to.deep.equal([
        {
          userId: 'someUserId',
        },
      ]);

      TaskNotificationService.notifyTaskCompletedWhenAddedAssignedAdmin.restore();
    });
  });
});
