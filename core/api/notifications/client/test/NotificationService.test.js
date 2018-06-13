/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';
import { Bert } from 'meteor/themeteorchef:bert';

import NotificationService from '../NotificationService';

describe('Notification Service', () => {
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
