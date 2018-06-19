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

      it('creates a new account', (done) => {
        options.email = newUserEmail;

        adminCreateUser
          .run({ options, role })
          .then((newUserId) => {
            expect(Meteor.users.find({ _id: newUserId }).count()).to.equal(1);

            done();
          });
      });

      it('calls UserSecurity', (done) => {
        sinon
          .stub(UserSecurity, 'checkPermissionToAddUser')
          .callsFake(() => true);
        options.email = newUserEmail;

        adminCreateUser.run({ options, role }).then(() => {
          expect(UserSecurity.checkPermissionToAddUser.getCall(0).args).to.deep.equal([{ role }]);

          UserSecurity.checkPermissionToAddUser.restore();

          done();
        });
      });

      it('calls UserService.adminCreateUser', (done) => {
        sinon.stub(UserService, 'adminCreateUser').callsFake(() => true);
        options.email = newUserEmail;

        adminCreateUser.run({ options, role }).then(() => {
          expect(UserService.adminCreateUser.getCall(0).args).to.deep.equal([
            { options, role },
          ]);

          UserService.adminCreateUser.restore();
          
          done();
        });
      });

      it('creates a new account with the provided email', (done) => {
        options.email = newUserEmail;

        adminCreateUser.run({ options, role }).then((newUserId) => {
          assert.equal(
            Meteor.users.findOne(newUserId).emails[0].address,
            newUserEmail,
          );

          done();
        });
      });

      it('creates a new account with the provided role', (done) => {
        options.email = newUserEmail;

        adminCreateUser
          .run({ options, role })
          .then((newUserId) => {
            assert.equal(Roles.userIsInRole(newUserId, role), true);

            done();
          });
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

        sinon.stub(UserService, 'update');
      });

      afterEach(() => {
        Meteor.userId.restore();
        SecurityService.currentUserIsAdmin.restore();
        UserService.update.restore();
      });

      it('calls UserService.update  when current user is admin', (done) => {
        sinon.stub(Meteor, 'userId').callsFake(() => adminId);
        sinon.stub(SecurityService, 'currentUserIsAdmin').callsFake(() => true);
       
        editUser.run({ userId: user._id, object }).then(() => {
          expect(SecurityService.currentUserIsAdmin.getCall(0).args).to.deep.equal([]);

          expect(UserService.update.getCall(0).args).to.deep.equal([
            { userId: user._id, object },
          ]);

          done();
        });
      });

      it('calls UserService.update when current user is owner', (done) => {
        sinon.stub(Meteor, 'userId').callsFake(() => user._id);
        sinon
          .stub(SecurityService, 'currentUserIsAdmin')
          .callsFake(() => false);
        sinon.stub(SecurityService, 'checkUserLoggedIn').callsFake(() => true);

        editUser.run({ userId: user._id, object }).then(() => {
          expect(SecurityService.currentUserIsAdmin.getCall(0).args).to.deep.equal([]);
          expect(SecurityService.checkUserLoggedIn.getCall(0).args).to.deep.equal([user._id]);

          expect(UserService.update.getCall(0).args).to.deep.equal([
            { userId: user._id, object },
          ]);

          SecurityService.checkUserLoggedIn.restore();

          done();
        });
      });

      it("throws and doesn't call UserService.update when current user is neither admin or owner", (done) => {
        sinon.stub(Meteor, 'userId').callsFake(() => otherUser._id);
        sinon
          .stub(SecurityService, 'currentUserIsAdmin')
          .callsFake(() => false);

        editUser.run({ userId: user._id, object }).catch(({ error }) => {
          assert.equal(error, 'NOT_AUTHORIZED');
          done();
        });
      });
    });
  });
});
