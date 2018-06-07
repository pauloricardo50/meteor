/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { expect, assert } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import sinon from 'sinon';

import { stubCollections } from 'core/utils/testHelpers';
import {
  doesUserExist,
  checkPermissionToAddUser,
  adminCreateUser,
  editUser,
} from '../../methodDefinitions';
import { ROLES } from '../../userConstants';

describe.only('users', () => {
  beforeEach(() => {
    resetDatabase();
    stubCollections();
  });

  afterEach(() => {
    stubCollections.restore();
  });

  describe('methods', () => {
    describe('doesUserExist', () => {
      let email;

      beforeEach(() => {
        email = 'yep@yop.com';
        Factory.create('user', {
          emails: [{ address: email, verified: false }],
        });
      });

      it('finds an existing user', () =>
        doesUserExist.run({ email }).then((result) => {
          expect(result).to.equal(true);
        }));

      it('returns false with an email containing another one', () => {
        email += 'a';
        return doesUserExist.run({ email }).then((result) => {
          expect(result).to.equal(false);
        });
      });

      it('returns false with a substring of a user', () => {
        email = email.slice(0, -1);
        return doesUserExist.run({ email }).then((result) => {
          expect(result).to.equal(false);
        });
      });

      it('returns false with totally different email', () => {
        const inexistentEmail = 'hello@world.com';
        return doesUserExist.run({ email: inexistentEmail }).then((result) => {
          expect(result).to.equal(false);
        });
      });
    });

    describe('checkPermissionToAddUser', () => {
      const userRole = ROLES.USER;
      const adminRole = ROLES.ADMIN;
      const devRole = ROLES.DEV;
      const lenderRole = ROLES.LENDER;
      const otherRole = 'OTHER';
      let context;
      let admin;

      beforeEach(() => {
        admin = Factory.create('admin');
        context = { userId: admin._id };

        sinon.stub(Meteor, 'userId').callsFake(() => admin._id);
      });

      afterEach(() => {
        stubCollections.restore();
        Meteor.userId.restore();
      });

      it('throws if passed another role than the ones defined', () =>
        checkPermissionToAddUser
          .run({ role: otherRole })
          .catch(({ error }) => {
            assert.equal(error, 'INCORRECT_ROLE');
          }));

      it('throws if you try to add devs without dev privileges', () =>
        checkPermissionToAddUser
          .run({ role: devRole })
          .catch(({ error }) => {
            assert.equal(error, 'NOT_AUTHORIZED');
          }));

      it('throws if you try to add admins without dev privileges', () =>
        checkPermissionToAddUser
          .run({ role: adminRole })
          .catch(({ error }) => {
            assert.equal(error, 'NOT_AUTHORIZED');
          }));

      it('throws if you try to add users with user privileges', () => {
        const user = Factory.create('user')._id;
        context = { userId: user._id };

        Meteor.userId.restore();
        sinon.stub(Meteor, 'userId').callsFake(() => user._id);
        return checkPermissionToAddUser
          .run({ role: userRole })
          .catch(({ error }) => {
            assert.equal(error, 'NOT_AUTHORIZED');
          });
      });
    });

    describe('adminCreateUser', () => {
      let existingUserEmail;
      let newUserEmail;
      let options;
      let adminId;
      const context = { userId: adminId };
      const role = ROLES.USER;

      beforeEach(() => {
        existingUserEmail = 'existing@yop.com';
        newUserEmail = 'new@yop.com';
        options = {
          firstName: 'firstName',
          lastName: 'lastName',
          phone: '12345678',
        };

        adminId = Factory.create('admin')._id;

        sinon.stub(Meteor, 'userId').callsFake(() => adminId);
        sinon.stub(Accounts, 'sendEnrollmentEmail').callsFake(() => true);
      });

      afterEach(() => {
        stubCollections.restore();
        Meteor.userId.restore();
        Accounts.sendEnrollmentEmail.restore();
      });

      it('it throws if it finds a user with the same email', () => {
        Factory.create('user', {
          emails: [{ address: existingUserEmail, verified: false }],
        });

        options.email = existingUserEmail;

        return adminCreateUser
          .run({ options, role })
          .catch(({ error }) => assert.equal(error, 'DUPLICATE_EMAIL'));
      });

      it('it creates a new account', () => {
        options.email = newUserEmail;
        return adminCreateUser.run({ options, role }).then(() => {
          // expect to find 2 users: admin and newUser
          assert.equal(Meteor.users.find({}).count(), 2);
        });
      });

      it('it creates a new account with the provided email', (done) => {
        options.email = newUserEmail;
        return adminCreateUser
          .run({ options, role })
          .then((newUserId) => {
            assert.equal(
              Meteor.users.findOne(newUserId).emails[0].address,
              newUserEmail,
            );
            done();
          });
      });

      it('it creates a new account with the provided role', () => {
        options.email = newUserEmail;
        return adminCreateUser
          .run({ options, role })
          .then(newUserId => assert.equal(Roles.userIsInRole(newUserId, role), true));
      });
    });

    describe('editUser', () => {
      let user;
      let otherUser;
      let adminId;
      let context;
      const object = {
        firstName: 'newFirstName',
        lastName: 'newLastName',
        phone: '1000000',
      };

      beforeEach(() => {
        adminId = Factory.create('admin')._id;
        user = Factory.create('user');
        otherUser = Factory.create('user');
      });

      afterEach(() => {
        stubCollections.restore();
        Meteor.userId.restore();
      });

      it('it throws if a user tries to edit another user', () => {
        context = { userId: otherUser._id };
        sinon.stub(Meteor, 'userId').callsFake(() => otherUser._id);

        return editUser
          .run({ userId: user._id, object })
          .catch(({ error }) => assert.equal(error, 'NOT_AUTHORIZED'));
      });

      it('it updates the user account with provided data', (done) => {
        context = { userId: adminId };
        const userId = user._id;
        sinon.stub(Meteor, 'userId').callsFake(() => adminId);

        return editUser
          .run({ userId, object })
          .then((result) => {
            if (result > 0) {
              const editedUser = Meteor.users.findOne(userId);
              assert.equal(editedUser.firstName, object.firstName);
              assert.equal(editedUser.lastName, object.lastName);
              assert.equal(editedUser.phone, object.phone);
            }
            done();
          });
      });
    });
  });
});

