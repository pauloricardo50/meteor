/* eslint-env mocha */
import { expect } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import sinon from 'sinon';
import { Accounts } from 'meteor/accounts-base';

import { resetDatabase } from 'meteor/xolvio:cleaner';
import UserService from '../../UserService';
import UserSecurity from '../../../security/collections/UserSecurity';
import { ROLES } from '../../userConstants';

describe('UserService', () => {
  const firstName = 'testFirstName';
  const lastName = 'testLastName';
  let user;
  let newUserId;
  let newUserEmail;
  let options;
  const role = ROLES.USER;

  beforeEach(() => {
    resetDatabase();

    newUserId = 'newUserId';
    newUserEmail = 'new@yop.com';
    options = {
      firstName: 'firstName',
      lastName: 'lastName',
      phoneNumbers: '12345678',
    };
    user = Factory.create('user', { firstName, lastName });
  });

  describe('adminCreateUser', () => {
    beforeEach(() => {
      sinon.stub(UserSecurity, 'isAllowedToInsertByRole').callsFake(() => true);
      sinon.stub(Accounts, 'sendEnrollmentEmail');
      sinon.stub(Accounts, 'createUser').callsFake(() => newUserId);
    });

    afterEach(() => {
      UserSecurity.isAllowedToInsertByRole.restore();
      Accounts.sendEnrollmentEmail.restore();
      Accounts.createUser.restore();
    });

    it('calls UserService.createUser when receives a valid, new email', () => {
      sinon.stub(UserService, 'createUser');

      options.email = newUserEmail;
      UserService.adminCreateUser({ options, role });

      expect(UserService.createUser.getCall(0).args).to.deep.equal([
        { options, role },
      ]);

      UserService.createUser.restore();
    });

    it('calls UserService.update when receiving a userId from UserService.createUser', () => {
      sinon.stub(UserService, 'createUser').callsFake(() => newUserId);
      sinon.stub(UserService, 'update');

      options.email = newUserEmail;
      UserService.adminCreateUser({ options, role });

      expect(UserService.update.getCall(0).args).to.deep.equal([
        { userId: newUserId, object: { ...options } },
      ]);

      UserService.createUser.restore();
      UserService.update.restore();
    });

    it('calls Accounts.sendEnrollmentEmail when receiving a userId from UserService.createUser', () => {
      options.email = newUserEmail;
      UserService.adminCreateUser({ options, role });

      expect(Accounts.sendEnrollmentEmail.getCall(0).args).to.deep.equal([
        newUserId,
      ]);
    });
  });

  describe('getUserById', () => {
    it('returns a user', () =>
      expect(UserService.getUserById({ userId: user._id })).to.deep.equal(user));
  });
});
