/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';
import { Bert } from 'meteor/themeteorchef:bert';

import NotificationService from '../NotificationService';
import SecurityService from '../../../security';

describe('Notification Service', () => {
  describe('notifyAdmin', () => {
    beforeEach(() => {
      sinon.stub(NotificationService, 'alert');
    });

    afterEach(() => {
      NotificationService.alert.restore();
    });

    it('calls `NotificationService.alert` with the correct arguments', () => {
      sinon.stub(SecurityService, 'currentUserIsAdmin').callsFake(() => true);

      const title = 'A title';
      const message = 'A message';

      NotificationService.notifyAdmin({ title, message });
      expect(NotificationService.alert.getCall(0).args).to.deep.equal([
        { title, message },
      ]);

      SecurityService.currentUserIsAdmin.restore();
    });

    it(`prevents calling 'NotificationService.alert'
        when current user is not admin`, () => {
      sinon.stub(SecurityService, 'currentUserIsAdmin').callsFake(() => false);

      NotificationService.notifyAdmin({
        title: 'A title',
        message: 'A message',
      });

      expect(NotificationService.alert.called).to.equal(false);

      SecurityService.currentUserIsAdmin.restore();
    });
  });

  describe('alert', () => {
    beforeEach(() => {
      sinon.stub(Bert, 'alert');
    });

    afterEach(() => {
      Bert.alert.restore();
    });

    it('triggers a bert alert with the correct arguments', () => {
      const title = 'A title';
      const message = 'A message';
      NotificationService.alert({ title, message });

      expect(Bert.alert.getCall(0).args).to.deep.equal([
        {
          title,
          message,
          type: 'success',
          style: 'fixed-top',
        },
      ]);
    });
  });
});
