/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import ServerEventService from '../../../events/ServerEventService';
import { assignAdminToNewUser, notifyAdmin } from '../../../methods';
import UserService from '../../UserService';
import SecurityService from '../../../security';

describe('User methods', () => {
  describe('assignAdminToNewUser', () => {
    beforeEach(() => {
      sinon.stub(ServerEventService, 'emitMethod');
      sinon.stub(notifyAdmin, 'run');
      sinon.stub(SecurityService, 'checkCurrentUserIsAdmin');
      sinon.stub(UserService, 'assignAdminToUser');
    });

    afterEach(() => {
      ServerEventService.emitMethod.restore();
      notifyAdmin.run.restore();
      SecurityService.checkCurrentUserIsAdmin.restore();
      UserService.assignAdminToUser.restore();
    });

    it('runs the `notifyAdmin` method with correct arguments', async () => {
      expect(notifyAdmin.run.called).to.equal(false);

      await assignAdminToNewUser.run({ userId: 'userId', adminId: 'adminId' });

      expect(notifyAdmin.run.getCall(0).args).to.deep.equal([
        {
          title: 'Task Completed',
          message: 'Completed task for admin to user assignment',
        },
      ]);
    });
  });
});
