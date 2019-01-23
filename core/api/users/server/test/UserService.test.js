/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { ROLES } from '../../userConstants';
import UserService from '../UserService';

describe('UserService', () => {
  const firstName = 'testFirstName';
  const lastName = 'testLastName';
  let user;

  beforeEach(() => {
    resetDatabase();

    user = Factory.create('user', { firstName, lastName });
    sinon.stub(UserService, 'sendEnrollmentEmail').callsFake(() => {});
  });

  afterEach(() => {
    UserService.sendEnrollmentEmail.restore();
  });

  describe('createUser', () => {
    it('creates a user with a role', () => {
      const options = { email: 'test@test.com' };
      const userId = UserService.createUser({ options, role: ROLES.USER });
      user = UserService.getUserById({ userId });

      expect(!!user).to.equal(true);
    });

    it('uses all options to create the user', () => {
      const options = { email: 'test@test.com', username: 'dude' };
      const userId = UserService.createUser({ options, role: ROLES.USER });
      user = UserService.getUserById({ userId });

      expect(user.emails[0].address).to.equal(options.email);
      expect(user.username).to.equal(options.username);
    });

    it('does not set additional stuff', () => {
      const options = { email: 'test@test.com', firstName: 'dude' };
      const userId = UserService.createUser({ options, role: ROLES.USER });
      user = UserService.getUserById({ userId });

      expect(user.firstName).to.equal(undefined);
    });
  });

  describe('adminCreateUser', () => {
    it('creates a user', () => {
      const options = { email: 'test@test.com' };
      const userId = UserService.adminCreateUser({ options, role: ROLES.USER });
      user = UserService.getUserById({ userId });

      expect(!!user).to.equal(true);
    });

    it('adds any additional info on options to the user', () => {
      const options = { email: 'test@test.com', firstName: 'dude' };
      const userId = UserService.adminCreateUser({ options, role: ROLES.USER });
      user = UserService.getUserById({ userId });

      expect(user.firstName).to.equal(options.firstName);
    });

    it('does not send enrollment email by default', () => {
      const options = { email: 'test@test.com' };
      const userId = UserService.adminCreateUser({
        options,
        role: ROLES.USER,
      });

      expect(UserService.sendEnrollmentEmail.getCall(0)).to.equal(null);
    });

    it('sends enrollment email when asked to', () => {
      const options = { email: 'test@test.com', sendEnrollmentEmail: true };
      const userId = UserService.adminCreateUser({
        options,
        role: ROLES.USER,
      });

      expect(UserService.sendEnrollmentEmail.getCall(0).args[0]).to.deep.equal({
        userId,
      });
    });

    it('assigns an adminId if the user is a USER', () => {
      const options = { email: 'test@test.com' };
      const adminId = 'some admin';
      const userId = UserService.adminCreateUser({
        options,
        role: ROLES.USER,
        adminId,
      });
      user = UserService.getUserById({ userId });

      expect(user.assignedEmployeeId).to.equal(adminId);
    });

    it('does not assign anyone if the user is not USER', () => {
      const options = { email: 'test@test.com' };
      const adminId = 'some admin';
      const userId = UserService.adminCreateUser({
        options,
        role: ROLES.ADMIN,
        adminId,
      });
      user = UserService.getUserById({ userId });

      expect(user.assignedEmployeeId).to.equal(undefined);
    });

    it('does not assign anyone if the user is not USER', () => {
      const options = { email: 'test@test.com' };
      const adminId = 'some admin';
      const userId = UserService.adminCreateUser({
        options,
        role: ROLES.ADMIN,
        adminId,
      });
      user = UserService.getUserById({ userId });

      expect(user.assignedEmployeeId).to.equal(undefined);
    });
  });

  describe('getUserById', () => {
    it('returns a user', () => {
      expect(UserService.getUserById({ userId: user._id })).to.deep.equal(user);
    });

    it('returns undefined if no user exists', () => {
      expect(UserService.getUserById({ userId: 'unknownId' })).to.equal(undefined);
    });
  });

  describe('update', () => {
    it('updates a user', () => {
      const newFirstName = 'joe';
      expect(UserService.getUserById({ userId: user._id }).firstName).to.equal(firstName);
      UserService.update({
        userId: user._id,
        object: { firstName: newFirstName },
      });
      expect(UserService.getUserById({ userId: user._id }).firstName).to.equal(newFirstName);
    });

    it('does not do anything if object is not defined', () => {
      UserService.update({ userId: user._id });
      expect(UserService.getUserById({ userId: user._id })).to.deep.equal(user);
    });

    it('does not do anything if object empty', () => {
      UserService.update({ userId: user._id, object: {} });
      expect(UserService.getUserById({ userId: user._id })).to.deep.equal(user);
    });
  });

  describe('remove', () => {
    it('removes a user', () => {
      expect(UserService.getUserById({ userId: user._id })).to.deep.equal(user);
      UserService.remove({ userId: user._id });
      expect(UserService.getUserById({ userId: user._id })).to.equal(undefined);
    });
  });

  describe('assignAdminToUser', () => {
    it('assigns an admin to a user', () => {
      const adminId = 'my dude';
      expect(UserService.getUserById({ userId: user._id }).assignedEmployeeId).to.equal(undefined);
      UserService.assignAdminToUser({ userId: user._id, adminId });
      expect(UserService.getUserById({ userId: user._id }).assignedEmployeeId).to.equal(adminId);
    });

    it('does not fail if adminId is undefined', () => {
      const adminId = undefined;
      expect(UserService.getUserById({ userId: user._id }).assignedEmployeeId).to.equal(undefined);
      UserService.assignAdminToUser({ userId: user._id, adminId });
      expect(UserService.getUserById({ userId: user._id }).assignedEmployeeId).to.equal(adminId);
    });
  });

  describe('getUsersByRole', () => {
    it('gets all users for a role', () => {
      Factory.create('admin', { firstName, lastName });
      Factory.create('admin', { firstName, lastName });
      Factory.create('dev', { firstName, lastName });
      Factory.create('dev', { firstName, lastName });
      Factory.create('dev', { firstName, lastName });

      expect(UserService.getUsersByRole(ROLES.USER).length).to.equal(1);
      expect(UserService.getUsersByRole(ROLES.ADMIN).length).to.equal(2);
      expect(UserService.getUsersByRole(ROLES.DEV).length).to.equal(3);
    });
  });

  describe('setRole', () => {
    it('changes the role of a user', () => {
      const newRole = ROLES.DEV;
      expect(UserService.getUserById({ userId: user._id }).roles).to.deep.equal([ROLES.USER]);
      UserService.setRole({ userId: user._id, role: newRole });
      expect(UserService.getUserById({ userId: user._id }).roles).to.deep.equal([newRole]);
    });

    it('throws if an unauthorized role is set', () => {
      const newRole = 'some role';

      expect(() =>
        UserService.setRole({ userId: user._id, role: newRole })).to.throw(`${newRole} is not an allowed value`);
    });
  });

  describe('doesUserExist', () => {
    let email;

    beforeEach(() => {
      email = 'yep@yop.com';
      Factory.create('user', {
        emails: [{ address: email, verified: false }],
      });
    });

    it('finds an existing user', () => {
      expect(UserService.doesUserExist({ email })).to.equal(true);
    });

    it('returns false with an email containing another one', () => {
      email += 'a';
      expect(UserService.doesUserExist({ email })).to.equal(false);
    });

    it('returns false with a substring of a user', () => {
      email = email.slice(0, -1);
      expect(UserService.doesUserExist({ email })).to.equal(false);
    });

    it('returns false with totally different email', () => {
      const inexistentEmail = 'hello@world.com';
      expect(UserService.doesUserExist({ email: inexistentEmail })).to.equal(false);
    });
  });

  describe('getUserByPasswordResetToken', () => {
    it('returns a user if found', () => {
      const token = 'testToken';
      const userId = UserService.testCreateUser({
        user: {
          services: { password: { reset: { token } } },
        },
      });
      expect(!!UserService.getUserByPasswordResetToken({ token })).to.equal(true);
    });

    it('only returns the necessary data', () => {
      const token = 'testToken';
      const userId = UserService.testCreateUser({
        user: {
          services: { password: { reset: { token } } },
          firstName,
          lastName,
          emails: [{ address: 'yo@dude.com', verified: false }],
          phoneNumbers: ['secretNumber'],
        },
      });
      expect(UserService.getUserByPasswordResetToken({ token })).to.deep.equal({
        _id: userId,
        firstName,
        lastName,
        emails: [{ address: 'yo@dude.com', verified: false }],
      });
    });

    it('returns undefined if no user is found', () => {
      expect(!!UserService.getUserByPasswordResetToken({
        token: 'some unknown token',
      })).to.equal(false);
    });
  });

  describe('hasPromotion', () => {
    it('returns false if the user does not have the promotion', () => {
      const userId = Factory.create('user')._id;
      const loanId = Factory.create('loan', {
        userId,
        promotionLinks: [{ _id: 'test' }],
      })._id;

      expect(UserService.hasPromotion({ userId, promotionId: 'test2' })).to.equal(false);
    });
  });
});
