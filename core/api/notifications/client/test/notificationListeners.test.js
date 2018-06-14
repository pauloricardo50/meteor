/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import ClientEventService from '../../../events/ClientEventService';
import '../../../events/client/registerClientListeners';
import { setFileStatus, assignAdminToNewUser } from '../../../methods';
import {
  fileVerifiedNotificationListener,
  adminAssignedToNewUserNotificationListener,
} from '../notificationListeners';
import NotificationService from '../NotificationService';
import { FILE_STATUS } from '../../../constants';

describe('Notification Listeners', () => {
  describe('fileVerifiedNotificationListener', () => {
    it(`listens to ${setFileStatus.config.name} method`, () => {
      const {
        config: { name: methodName },
      } = setFileStatus;
      const listeners = ClientEventService.getListenerFunctions(methodName);
      expect(listeners.includes(fileVerifiedNotificationListener)).to.equal(true);
    });

    it('calls `NotificationService.notifyAdmin` with correct arguments', () => {
      sinon.stub(NotificationService, 'notifyAdmin');

      fileVerifiedNotificationListener({
        newStatus: FILE_STATUS.VALID,
      });

      expect(NotificationService.notifyAdmin.getCall(0).args).to.deep.equal([
        {
          title: 'Task Completed',
          message: 'Completed task of added file',
        },
      ]);

      NotificationService.notifyAdmin.restore();
    });
  });

  describe('adminAssignedToNewUserNotificationListener', () => {
    it(`listens to ${assignAdminToNewUser.config.name} method`, () => {
      const {
        config: { name: methodName },
      } = assignAdminToNewUser;
      const listeners = ClientEventService.getListenerFunctions(methodName);
      expect(listeners.includes(adminAssignedToNewUserNotificationListener)).to.equal(true);
    });

    it('calls `NotificationService.notifyAdmin` with correct arguments', () => {
      sinon.stub(NotificationService, 'notifyAdmin');

      adminAssignedToNewUserNotificationListener({
        newStatus: FILE_STATUS.VALID,
      });

      expect(NotificationService.notifyAdmin.getCall(0).args).to.deep.equal([
        {
          title: 'Task Completed',
          message: 'Completed task of admin to user assignment',
        },
      ]);

      NotificationService.notifyAdmin.restore();
    });
  });
});
