/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import ClientEventService from '../../../events/ClientEventService';
import '../../../events/client/registerClientListeners';
import { notifyAdmin } from '../../../methods';
import { notifyAdminListener } from '../notificationListeners';
import NotificationService from '../NotificationService';

describe('Notification Listeners', () => {
  describe('notifyAdminListener', () => {
    it(`listens to ${notifyAdmin.config.name} method`, () => {
      const {
        config: { name: methodName },
      } = notifyAdmin;
      const listeners = ClientEventService.getListenerFunctions(methodName);
      expect(listeners.includes(notifyAdminListener)).to.equal(true);
    });

    it('calls `NotificationService.alert` with correct arguments', () => {
      sinon.stub(NotificationService, 'alert');

      const alertParams = { title: 'Title', message: 'A message' };

      notifyAdminListener({
        ...alertParams,
        something: 'else',
      });

      expect(NotificationService.alert.getCall(0).args).to.deep.equal([
        alertParams,
      ]);

      NotificationService.alert.restore();
    });
  });
});
