/* eslint-env mocha */
import { expect } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import sinon from 'sinon';
import { Accounts } from 'meteor/accounts-base';

import { resetDatabase } from 'meteor/xolvio:cleaner';
import { stubCollections } from '../../../../utils/testHelpers';
import UserService from '../../UserService';
import UserSecurity from '../../../security/collections/UserSecurity';
import { ROLES } from '../../userConstants';

describe('UserService', () => {
  let newUserId;
  let existingUserEmail;
  let newUserEmail;
  let options;
  const role = ROLES.USER;

  beforeEach(() => {
    resetDatabase();
    stubCollections();

    // user = Factory.create('user', { firstName, lastName, phone });
    newUserId = 'newUserId';
    existingUserEmail = 'existing@yop.com';
    newUserEmail = 'new@yop.com';
    options = {
      firstName: 'firstName',
      lastName: 'lastName',
      phone: '12345678',
    };
  });

  afterEach(() => {
    stubCollections.restore();
  });

  describe('adminCreateUser', () => {
    beforeEach(() => {
      // user = { ...options, newUserEmail, _id: 'newUserId' };
      sinon
        .stub(UserSecurity, 'checkPermissionToAddUser')
        .callsFake(() => true);
      sinon.stub(Accounts, 'sendEnrollmentEmail');
      sinon.stub(Accounts, 'createUser').callsFake(() => newUserId);
    });

    afterEach(() => {
      UserSecurity.checkPermissionToAddUser.restore();
      Accounts.sendEnrollmentEmail.restore();
      Accounts.createUser.restore();
    });

    it('throws if it finds a user with the same email', () => {
      Factory.create('user', {
        emails: [{ address: existingUserEmail, verified: false }],
      });

      options.email = existingUserEmail;
      expect(() => UserService.adminCreateUser({ options, role })).to.throw(/[DUPLICATE_EMAIL]/);
    });

    it('calls UserService.createUser when receives a valid, new email', () => {
      expect(UserService.createUser.called).to.equal(false);

      options.email = newUserEmail;
      UserService.adminCreateUser({ options, role });

      expect(UserService.createUser.getCall(0).args).to.deep.equal([
        { options, role },
      ]);
    });

    it('calls UserService.editUser when receiving a userId from UserService.createUser', () => {
      expect(UserService.update.called).to.equal(false);

      options.email = newUserEmail;
      UserService.adminCreateUser({ options, role });

      expect(UserService.update.getCall(0).args).to.deep.equal([
        { userId: newUserId, object: { ...options } },
      ]);
    });

    it('calls Accounts.sendEnrollmentEmai when receiving a userId from UserService.createUser', () => {
      expect(Accounts.sendEnrollmentEmail.called).to.equal(false);

      options.email = newUserEmail;
      UserService.adminCreateUser({ options, role });

      expect(Accounts.sendEnrollmentEmail.getCall(0).args).to.deep.equal([
        newUserId,
      ]);
    });
  });
});
