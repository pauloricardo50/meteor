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
  adminCreateUser,
  editUser,
} from '../../methodDefinitions';
import { ROLES } from '../../userConstants';
import { SecurityService } from '../../../';
import UserSecurity from '../../../security/collections/UserSecurity';
import UserService from '../../UserService';

describe('users', () => {
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
        Meteor.userId.restore();
        Accounts.sendEnrollmentEmail.restore();
      });

      it('creates a new account', () => {
        options.email = newUserEmail;

        return adminCreateUser.run({ options, role }).then(() => {
          // expect to find 2 users: admin and newUser
          assert.equal(Meteor.users.find({}).count(), 2);
        });
      });

      it('calls UserSecurity', (done) => {
        sinon.stub(UserSecurity, 'checkPermissionToAddUser').callsFake(() => true);
        options.email = newUserEmail;

        adminCreateUser.run({ options, role }).then(() => {
          expect(UserSecurity.checkPermissionToAddUser.getCall(0).args)
            .to.deep.equal([{ role }]);
        });

        UserSecurity.checkPermissionToAddUser.restore();
        done();
      });

      it('calls UserService.adminCreateUser', (done) => {
        sinon.stub(UserService, 'adminCreateUser').callsFake(() => true);
        options.email = newUserEmail;

        adminCreateUser.run({ options, role }).then(() => {
          expect(UserService.adminCreateUser.getCall(0).args)
            .to.deep.equal([{ options, role }]);
        });

        UserService.adminCreateUser.restore();
        done();
      });

      it('creates a new account with the provided email', (done) => {
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

      it('creates a new account with the provided role', () => {
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
        Meteor.userId.restore();
        SecurityService.currentUserIsAdmin.restore();
        SecurityService.checkUserLoggedIn.restore();
      });

      it('updates the user when current user is admin', (done) => {
        sinon.stub(Meteor, 'userId').callsFake(() => adminId);
        sinon.stub(SecurityService, 'currentUserIsAdmin').callsFake(() => true);
        sinon.stub(SecurityService, 'checkUserLoggedIn').callsFake(() => false);

        return editUser
          .run({ userId: user._id, object })
          .then((result) => {
            expect(SecurityService.currentUserIsAdmin.called).to.equal(true);
            expect(SecurityService.currentUserIsAdmin.getCall(0).args)
              .to.deep.equal([]);

            if (result > 0) {
              const editedUser = Meteor.users.findOne(user._id);
              assert.equal(editedUser.firstName, object.firstName);
              assert.equal(editedUser.lastName, object.lastName);
              assert.equal(editedUser.phone, object.phone);
            }

            done();
          });
      });


      it('updates the user when current user is owner', (done) => {
        sinon.stub(Meteor, 'userId').callsFake(() => user._id);
        sinon.stub(SecurityService, 'currentUserIsAdmin').callsFake(() => false);
        sinon.stub(SecurityService, 'checkUserLoggedIn').callsFake(() => true);

        return editUser
          .run({ userId: user._id, object })
          .then((result) => {
            expect(SecurityService.currentUserIsAdmin.called).to.equal(true);
            expect(SecurityService.currentUserIsAdmin.getCall(0).args)
              .to.deep.equal([]);
            expect(SecurityService.checkUserLoggedIn.called).to.equal(true);
            expect(SecurityService.checkUserLoggedIn.getCall(0).args)
              .to.deep.equal([user._id]);

            if (result > 0) {
              const editedUser = Meteor.users.findOne(user._id);
              assert.equal(editedUser.firstName, object.firstName);
              assert.equal(editedUser.lastName, object.lastName);
              assert.equal(editedUser.phone, object.phone);
            }

            done();
          });
      });

      it('does not update the user when current user is neither admin or owner', () => {
        sinon.stub(Meteor, 'userId').callsFake(() => user._id);
        sinon.stub(SecurityService, 'currentUserIsAdmin').callsFake(() => false);
        sinon.stub(SecurityService, 'checkUserLoggedIn').callsFake(() => false);

        return editUser
          .run({ userId: user._id, object })
          .catch(({ error }) => assert.equal(error, 'SECURITY_ERROR'));
      });
    });
  });
});

