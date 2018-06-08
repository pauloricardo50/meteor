/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import { ClientEventService } from '../../../events';
import '../../../events/registerClientListeners';
import { setFileStatus, assignAdminToNewUser } from '../../../methods';
import {
  fileStatusChangedTaskNotificationListener,
  adminAssignedTaskNotificationListener,
} from '../../taskListeners';
import TaskNotificationService from '../../TasksNotificationService';

describe('Task Client Listeners', () => {
  describe('fileStatusChangedTaskNotificationListener', () => {
    it(`listens to \`${setFileStatus.config.name}\` method`, () => {
      const {
        config: { name: methodName },
      } = setFileStatus;
      const listeners = ClientEventService.getListenerFunctions(methodName);
      expect(listeners.includes(fileStatusChangedTaskNotificationListener)).to.equal(true);
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
      fileStatusChangedTaskNotificationListener(listenerParams);

      expect(TaskNotificationService.notifyTaskCompletedWhenFileStatusChanged.getCall(0).args).to.deep.equal([
        {
          fileKey: 'someFileKey',
          newStatus: 'SOME_STATUS',
        },
      ]);

      TaskNotificationService.notifyTaskCompletedWhenFileStatusChanged.restore();
    });
  });

  describe('adminAssignedTaskNotificationListener', () => {
    it(`listens to \`${assignAdminToNewUser.config.name}\` method`, () => {
      const {
        config: { name: methodName },
      } = assignAdminToNewUser;
      const listeners = ClientEventService.getListenerFunctions(methodName);
      expect(listeners.includes(adminAssignedTaskNotificationListener)).to.equal(true);
    });

    it('calls `TaskNotificationService.notifyTaskCompletedWhenAdminAssigned` function with the needed params', () => {
      sinon.stub(
        TaskNotificationService,
        'notifyTaskCompletedWhenAdminAssigned',
      );
      const listenerParams = {
        userId: 'someUserId',
        adminId: 'someAdminId',
      };

      expect(TaskNotificationService.notifyTaskCompletedWhenAdminAssigned.called).to.equal(false);
      adminAssignedTaskNotificationListener(listenerParams);

      expect(TaskNotificationService.notifyTaskCompletedWhenAdminAssigned.getCall(0)
        .args).to.deep.equal([
        {
          userId: 'someUserId',
        },
      ]);

      TaskNotificationService.notifyTaskCompletedWhenAdminAssigned.restore();
    });
  });
});
