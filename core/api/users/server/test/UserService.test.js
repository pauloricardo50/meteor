/* eslint-env mocha */
import { Factory } from 'meteor/dburles:factory';

import { expect } from 'chai';
import sinon from 'sinon';

import { checkEmails, resetDatabase } from '../../../../utils/testHelpers';
import BorrowerService from '../../../borrowers/server/BorrowerService';
import { EMAIL_IDS, EMAIL_TEMPLATES } from '../../../email/emailConstants';
import generator from '../../../factories/server';
import LoanService from '../../../loans/server/LoanService';
import { ddpWithUserId } from '../../../methods/methodHelpers';
import { PROMOTION_STATUS } from '../../../promotions/promotionConstants';
import { PROPERTY_CATEGORY } from '../../../properties/propertyConstants';
import PropertyService from '../../../properties/server/PropertyService';
import { proInviteUser } from '../../methodDefinitions';
import { ACQUISITION_CHANNELS, ROLES } from '../../userConstants';
import UserService from '../UserService';

describe('UserService', function () {
  this.timeout(10000);

  const firstName = 'TestFirstName';
  const lastName = 'TestLastName';
  let user;

  beforeEach(() => {
    resetDatabase();
    const { _id: userId } = Factory.create('user', { firstName, lastName });
    user = UserService.findOne(userId);
    sinon.stub(UserService, 'sendEnrollmentEmail').callsFake(() => {});
  });

  afterEach(() => {
    UserService.sendEnrollmentEmail.restore();
  });

  describe('createUser', () => {
    it('creates a user with a USER role by default', () => {
      const options = { email: 'test@test.com' };
      const userId = UserService.createUser({ options });
      user = UserService.get(userId, { roles: 1 });

      expect(user.roles[0]).to.deep.include({ _id: ROLES.USER });
    });

    it('creates a user with a PRO role', () => {
      const options = { email: 'test@test.com' };
      const userId = UserService.createUser({ options, role: ROLES.PRO });
      user = UserService.get(userId, { roles: 1 });

      expect(user.roles[0]).to.deep.include({ _id: ROLES.PRO });
    });

    it('uses all options to create the user', () => {
      const options = { email: 'test@test.com', username: 'dude' };
      const userId = UserService.createUser({ options, role: ROLES.USER });
      user = UserService.get(userId, { emails: 1, username: 1 });

      expect(user.emails[0].address).to.equal(options.email);
      expect(user.username).to.equal(options.username);
    });

    it('does not set additional stuff', () => {
      const options = { email: 'test@test.com', firstName: 'dude' };
      const userId = UserService.createUser({ options, role: ROLES.USER });
      user = UserService.get(userId, { firstName: 1 });

      expect(user.firstName).to.equal(undefined);
    });

    it('throws if you try to insert a user without role', () => {
      const options = { email: 'test@test.com' };
      expect(() => UserService.createUser({ options, role: null })).to.throw(
        'must have a role',
      );
    });
  });

  describe('adminCreateUser', () => {
    it('creates a user', () => {
      const userId = UserService.adminCreateUser({
        email: 'test@test.com',
        role: ROLES.USER,
      });
      user = UserService.findOne(userId);

      expect(!!user).to.equal(true);
    });

    it('adds any additional info on options to the user', () => {
      const options = { email: 'test@test.com', firstName: 'Dude' };
      const userId = UserService.adminCreateUser({
        ...options,
        role: ROLES.USER,
      });
      user = UserService.findOne(userId);

      expect(user.firstName).to.equal(options.firstName);
    });

    it('does not send enrollment email by default', () => {
      const options = { email: 'test@test.com' };
      UserService.adminCreateUser({
        ...options,
        role: ROLES.USER,
      });

      expect(UserService.sendEnrollmentEmail.getCall(0)).to.equal(null);
    });

    it('sends enrollment email when asked to', () => {
      const options = { email: 'test@test.com', sendEnrollmentEmail: true };
      const userId = UserService.adminCreateUser({
        ...options,
        role: ROLES.USER,
      });

      expect(UserService.sendEnrollmentEmail.getCall(0).args[0]).to.deep.equal({
        userId,
      });
    });

    it('assigns an adminId if the user is a USER', () => {
      const adminId = 'some admin';
      generator({ users: { _id: adminId, _factory: ROLES.ADVISOR } });
      const options = { email: 'test@test.com' };

      const userId = UserService.adminCreateUser({
        ...options,
        role: ROLES.USER,
        assignedEmployeeId: adminId,
      });
      user = UserService.findOne(userId);

      expect(user.assignedEmployeeId).to.equal(adminId);
    });

    it('does not assign anyone if the user is not USER', () => {
      const options = { email: 'test@test.com' };
      const adminId = 'some admin';
      const userId = UserService.adminCreateUser({
        ...options,
        role: ROLES.ADMIN,
        adminId,
      });
      user = UserService.findOne(userId);

      expect(user.assignedEmployeeId).to.equal(undefined);
    });

    it('does not assign anyone if the user is not USER', () => {
      const options = { email: 'test@test.com' };
      const adminId = 'some admin';
      const userId = UserService.adminCreateUser({
        ...options,
        role: ROLES.ADMIN,
        adminId,
      });
      user = UserService.findOne(userId);

      expect(user.assignedEmployeeId).to.equal(undefined);
    });

    it('sets a hardcoded assignee per organisation', () => {
      generator({
        users: { _factory: ROLES.ADVISOR, _id: 'testAdminId' },
        organisations: { _id: 'testOrgId' },
      });

      const options = {
        email: 'test@test.com',
        referredByOrganisation: 'testOrgId',
      };

      const userId = UserService.adminCreateUser({
        ...options,
      });

      user = UserService.get(userId, { assignedEmployeeId: 1 });
      expect(user.assignedEmployeeId).to.equal('testAdminId');
    });
  });

  describe('anonymousCreateUser', () => {
    it('sets REFERRAL_ORGANIC acquisitionChannel if the user is referred', () => {
      generator({
        organisations: [{ _id: 'org1' }],
      });

      const userId = UserService.anonymousCreateUser({
        user: { email: 'test@e-potek.ch' },
        referralId: 'org1',
      });

      const { acquisitionChannel } = UserService.get(userId, {
        acquisitionChannel: 1,
      });
      expect(acquisitionChannel).to.equal(
        ACQUISITION_CHANNELS.REFERRAL_ORGANIC,
      );
    });

    it('ignores the referralId of the user if the loan already has one', () => {
      generator({
        loans: { _id: 'loanId', anonymous: true, referralId: 'org1' },
        organisations: [{ _id: 'org2' }, { _id: 'org1' }],
      });

      const userId = UserService.anonymousCreateUser({
        user: { email: 'test@e-potek.ch' },
        loanId: 'loanId',
        referralId: 'org2',
      });

      const { referredByOrganisation } = UserService.get(userId, {
        referredByOrganisation: { _id: 1 },
      });
      expect(referredByOrganisation._id).to.equal('org1');
    });

    it('sets the referral if specified in the cookies', () => {
      generator({
        loans: { _id: 'loanId', anonymous: true },
        organisations: [{ _id: 'org2' }, { _id: 'org1' }],
        users: { _id: 'pro1', _factory: ROLES.PRO },
      });

      const userId = UserService.anonymousCreateUser({
        user: { email: 'test@e-potek.ch' },
        loanId: 'loanId',
        referralId: 'pro1',
      });

      const { referredByUser } = UserService.get(userId, {
        referredByUser: { _id: 1 },
      });
      expect(referredByUser._id).to.equal('pro1');
    });

    it('should assign the referrals assignee to the new user and loan if it exists', () => {
      generator({
        loans: { _id: 'loanId', anonymous: true, referralId: 'org2' },
        users: [
          { _id: 'pro1', _factory: ROLES.PRO },
          { _id: 'advisor1', _factory: ROLES.ADVISOR },
          { _id: 'advisor2', _factory: ROLES.ADVISOR },
        ],
        organisations: [{ _id: 'org2', assignee: { _id: 'advisor2' } }],
      });

      const userId = UserService.anonymousCreateUser({
        user: { email: 'test@e-potek.ch' },
        loanId: 'loanId',
      });

      const { assignedEmployee, loans } = UserService.get(userId, {
        assignedEmployee: { _id: 1 },
        loans: { assignees: { _id: 1 } },
      });

      expect(assignedEmployee._id).to.equal('advisor2');
      expect(loans[0].assignees[0]._id).to.equal('advisor2');
    });

    it('should cascade to the first available advisor', () => {
      generator({
        loans: { _id: 'loanId', anonymous: true, referralId: 'pro1' },
        users: [
          {
            _id: 'advisor1',
            _factory: ROLES.ADVISOR,
            roundRobinTimeout: 'Not here!',
          },
          { _id: 'advisor2', _factory: ROLES.ADVISOR },
          {
            _id: 'pro1',
            _factory: ROLES.PRO,
            assignedEmployee: { _id: 'advisor1' },
          },
        ],
      });

      const userId = UserService.anonymousCreateUser({
        user: { email: 'test@e-potek.ch' },
        loanId: 'loanId',
      });

      const { assignedEmployee, loans } = UserService.get(userId, {
        assignedEmployee: { _id: 1 },
        loans: { assignees: { _id: 1 } },
      });

      expect(assignedEmployee._id).to.equal('advisor2');
      expect(loans[0].assignees[0]._id).to.equal('advisor2');
    });

    it('assigns new users in round robin', () => {
      generator({
        users: [
          { _id: 'advisor1', _factory: ROLES.ADVISOR },
          { _id: 'advisor2', _factory: ROLES.ADVISOR },
          { _id: 'advisor3', _factory: ROLES.ADVISOR },
        ],
      });

      const user1 = UserService.anonymousCreateUser({
        user: { email: 'test1@e-potek.ch' },
      });
      const user2 = UserService.anonymousCreateUser({
        user: { email: 'test2@e-potek.ch' },
      });
      const user3 = UserService.anonymousCreateUser({
        user: { email: 'test3@e-potek.ch' },
      });
      const user4 = UserService.anonymousCreateUser({
        user: { email: 'test4@e-potek.ch' },
      });

      expect(
        UserService.get(user1, { assignedEmployeeId: 1 }).assignedEmployeeId,
      ).to.equal('advisor1');
      expect(
        UserService.get(user2, { assignedEmployeeId: 1 }).assignedEmployeeId,
      ).to.equal('advisor2');
      expect(
        UserService.get(user3, { assignedEmployeeId: 1 }).assignedEmployeeId,
      ).to.equal('advisor3');
      expect(
        UserService.get(user4, { assignedEmployeeId: 1 }).assignedEmployeeId,
      ).to.equal('advisor1');
    });
  });

  describe('update', () => {
    it('updates a user', () => {
      const newFirstName = 'Joe';
      expect(UserService.findOne(user._id).firstName).to.equal(firstName);
      UserService.update({
        userId: user._id,
        object: { firstName: newFirstName },
      });
      expect(UserService.findOne(user._id).firstName).to.equal(newFirstName);
    });

    it('updates a user: check the sentence case', () => {
      const newFirstName = 'jon';
      UserService.update({
        userId: user._id,
        object: { firstName: newFirstName },
      });
      expect(UserService.findOne(user._id).firstName).to.equal('Jon');
    });

    it('does not do anything if object is not defined', () => {
      UserService.update({ userId: user._id });
      expect(UserService.findOne(user._id)).to.deep.equal(user);
    });

    it('does not do anything if object empty', () => {
      UserService.update({ userId: user._id, object: {} });
      expect(UserService.findOne(user._id)).to.deep.equal(user);
    });
  });

  describe('toggle account', () => {
    it('toggles the account', () => {
      UserService.toggleAccount({ userId: user._id });

      expect(UserService.findOne(user._id).isDisabled).to.not.equal(
        user.isDisabled,
      );

      UserService.toggleAccount({ userId: user._id });

      expect(UserService.findOne(user._id).isDisabled).to.equal(
        user.isDisabled,
      );
    });
  });

  describe('remove', () => {
    it('removes a user', () => {
      expect(UserService.findOne(user._id)).to.deep.equal(user);
      UserService.remove({ userId: user._id });
      expect(UserService.findOne(user._id)).to.equal(undefined);
    });

    it('autoremoves all loans, properties and borrowers', () => {
      Factory.create('loan', { userId: user._id });
      Factory.create('loan', { userId: user._id });
      Factory.create('borrower', { userId: user._id });
      Factory.create('borrower', { userId: user._id });
      Factory.create('property', { userId: user._id });
      Factory.create('property', { userId: user._id });
      UserService.remove({ userId: user._id });
      expect(UserService.findOne(user._id)).to.equal(undefined);
      expect(LoanService.countAll()).to.equal(0);
      expect(BorrowerService.countAll()).to.equal(0);
      expect(PropertyService.countAll()).to.equal(0);
    });

    it('does not remove proProperties when it is not the only customer', () => {
      // User property
      Factory.create('property', { userId: user._id });
      // Pro property
      Factory.create('property', {
        _id: 'propertyId',
        category: PROPERTY_CATEGORY.PRO,
      });

      Factory.create('user', { _id: 'userId2' });

      LoanService.insertPropertyLoan({
        userId: user._id,
        propertyIds: ['propertyId'],
      });

      LoanService.insertPropertyLoan({
        userId: 'userId2',
        propertyIds: ['propertyId'],
      });

      UserService.remove({ userId: user._id });
      expect(PropertyService.countAll()).to.equal(1);
    });

    it('does not remove proProperties when it is the only customer', () => {
      // User property
      Factory.create('property', { userId: user._id });
      // Pro property
      Factory.create('property', {
        _id: 'propertyId',
        category: PROPERTY_CATEGORY.PRO,
      });
      LoanService.insertPropertyLoan({
        userId: user._id,
        propertyIds: ['propertyId'],
      });
      UserService.remove({ userId: user._id });
      expect(PropertyService.countAll()).to.equal(1);
    });
  });

  describe('doesUserExist', () => {
    let email;

    beforeEach(() => {
      email = 'yep@yop.com';
      Factory.create('user', { emails: [{ address: email, verified: false }] });
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
      expect(UserService.doesUserExist({ email: inexistentEmail })).to.equal(
        false,
      );
    });
  });

  describe('getUserByPasswordResetToken', () => {
    it('returns a user if found', () => {
      const token = 'testToken';
      const userId = UserService.testCreateUser({
        user: { services: { password: { reset: { token } } } },
      });
      expect(!!UserService.getUserByPasswordResetToken({ token })).to.equal(
        true,
      );
    });

    describe('getUserByPasswordResetToken', () => {
      it('returns a user if found', () => {
        const token = 'testToken';
        UserService.testCreateUser({
          user: { services: { password: { reset: { token } } } },
        });
        expect(!!UserService.getUserByPasswordResetToken({ token })).to.equal(
          true,
        );
      });

      it('only returns the necessary data', () => {
        const token = 'testToken';
        const userId = UserService.testCreateUser({
          user: {
            services: { password: { reset: { token } } },
            firstName,
            lastName,
            emails: [{ address: 'yo@dude.com', verified: false }],
            phoneNumbers: ['phoneNumber'],
            username: 'secretUsername',
          },
        });
        expect(
          UserService.getUserByPasswordResetToken({ token }),
        ).to.deep.equal({
          _id: userId,
          _collection: 'users',
          firstName,
          lastName,
          email: 'yo@dude.com',
          emails: [{ address: 'yo@dude.com', verified: false }],
          name: 'TestFirstName TestLastName',
          phoneNumbers: ['phoneNumber'],
          services: { password: { reset: { token } } },
        });
      });
    });

    it('returns undefined if no user is found', () => {
      expect(
        !!UserService.getUserByPasswordResetToken({
          token: 'some unknown token',
        }),
      ).to.equal(false);
    });
  });

  describe('hasPromotion', () => {
    it('returns false if the user does not have the promotion', () => {
      const userId = Factory.create('user')._id;
      const loanId = Factory.create('loan', {
        userId,
        promotionLinks: [{ _id: 'test' }],
      })._id;

      expect(
        UserService.hasPromotion({ userId, promotionId: 'test2' }),
      ).to.equal(false);
    });
  });

  describe('proInviteUser', () => {
    const userToInvite = {
      firstName: 'Bob',
      lastName: 'Dylan',
      email: 'bob@dylan.com',
      phoneNumber: '12345',
    };

    beforeEach(() => {
      resetDatabase();
      generator({
        users: [
          {
            _id: 'adminId',
            _factory: ROLES.ADVISOR,
            firstName: 'Admin',
            lastName: 'User',
          },
          {
            _id: 'proId',
            assignedEmployeeId: 'adminId',
            organisations: {
              _id: 'organisationId',
              name: 'bank',
              $metadata: { isMain: true },
            },
            _factory: ROLES.PRO,
            firstName: 'John',
            lastName: 'Doe',
            emails: [{ address: 'john@doe.com', verified: true }],
          },
        ],
      });
    });

    it('invites user to refer only', async () => {
      await ddpWithUserId('proId', () =>
        proInviteUser.run({ user: userToInvite }),
      );

      const userCreated = UserService.getByEmail(userToInvite.email, {
        assignedEmployeeId: 1,
        referredByUserLink: 1,
        referredByOrganisationLink: 1,
      });

      expect(userCreated.assignedEmployeeId).to.equal('adminId');
      expect(userCreated.referredByUserLink).to.equal('proId');
      expect(userCreated.referredByOrganisationLink).to.equal('organisationId');

      const emails = await checkEmails(2, { noExpect: true });
      expect(emails.length).to.equal(2);
      const {
        emailId,
        address,
        response: { status },
        template: {
          template_name,
          message: { from_email, subject, global_merge_vars, from_name },
        },
      } = emails.find(({ emailId }) => emailId === EMAIL_IDS.REFER_USER);
      expect(status).to.equal('sent');
      expect(emailId).to.equal(EMAIL_IDS.REFER_USER);
      expect(template_name).to.equal(
        EMAIL_TEMPLATES.NOTIFICATION_AND_CTA.mandrillId,
      );
      expect(address).to.equal('bob@dylan.com');
      expect(from_email).to.equal('team@e-potek.ch');
      expect(from_name).to.equal('e-Potek');
      expect(subject).to.equal('Vous avez été invité sur e-Potek');
      expect(
        global_merge_vars.find(({ name }) => name === 'BODY').content,
      ).to.include('John Doe (bank)');
      {
        const {
          emailId,
          address,
          response: { status },
          template: {
            template_name,
            message: { from_email, subject, global_merge_vars, from_name },
          },
        } = emails.find(
          ({ emailId }) => emailId === EMAIL_IDS.CONFIRM_USER_INVITATION,
        );
        expect(status).to.equal('sent');
        expect(emailId).to.equal(EMAIL_IDS.CONFIRM_USER_INVITATION);
        expect(template_name).to.equal(
          EMAIL_TEMPLATES.NOTIFICATION_AND_CTA.mandrillId,
        );
        expect(address).to.equal('john@doe.com');
        expect(from_email).to.equal('team@e-potek.ch');
        expect(from_name).to.equal('e-Potek');
        expect(subject).to.equal('Invitation réussie');
        expect(
          global_merge_vars.find(({ name }) => name === 'BODY').content,
        ).to.include('Bob Dylan (bob@dylan.com)');
      }
    });

    it('throws if user already exists and it is referOnly', () => {
      generator({
        users: { emails: [{ address: userToInvite.email, verified: false }] },
      });

      expect(() =>
        UserService.proInviteUser({
          user: userToInvite,
          referOnly: true,
          proUserId: 'proId',
        }),
      ).to.throw('Ce client existe déjà');
    });

    it('invites user to promotion', () => {
      generator({
        properties: { _id: 'prop' },
        promotions: {
          _id: 'promotionId',
          status: PROMOTION_STATUS.OPEN,
          assignedEmployeeId: 'adminId',
          users: {
            _id: 'proId',
            $metadata: { permissions: { canInviteCustomers: true } },
          },
          promotionLots: { _id: 'pLotId', propertyLinks: [{ _id: 'prop' }] },
        },
      });

      const {
        userId,
        isNewUser,
        proId,
        admin,
        pro,
      } = UserService.proInviteUser({
        user: {
          ...userToInvite,
          showAllLots: false,
          promotionLotIds: ['pLotId'],
        },
        promotionIds: ['promotionId'],
        proUserId: 'proId',
      });

      const userCreated = UserService.getByEmail(userToInvite.email, {
        assignedEmployeeId: 1,
        referredByUserLink: 1,
        referredByOrganisationLink: 1,
      });
      const loan = LoanService.get(
        { userId: userCreated._id },
        { promotionLinks: 1, promotionOptionLinks: 1 },
      );

      expect(userCreated._id).to.equal(userId);
      expect(isNewUser).to.equal(true);
      expect(proId).to.equal('proId');
      expect(admin._id).to.equal(userCreated.assignedEmployeeId);
      expect(pro._id).to.equal('proId');
      expect(userCreated.assignedEmployeeId).to.equal('adminId');
      expect(userCreated.referredByUserLink).to.equal('proId');
      expect(userCreated.referredByOrganisationLink).to.equal('organisationId');
      expect(loan.promotionLinks[0]._id).to.equal('promotionId');
      expect(loan.promotionLinks[0].invitedBy).to.equal('proId');
      expect(loan.promotionLinks[0].showAllLots).to.equal(false);
      expect(loan.promotionOptionLinks.length).to.equal(1);
    });

    it('does not assign the promotionAssignee if he/she is away', () => {
      generator({
        users: [
          { _id: 'admin1', _factory: ROLES.ADVISOR, roundRobinTimeout: 'Gone' },
          { _id: 'admin2', _factory: ROLES.ADVISOR },
        ],
        properties: { _id: 'prop' },
        promotions: {
          _id: 'promotionId',
          status: PROMOTION_STATUS.OPEN,
          assignedEmployeeId: 'admin1',
          users: {
            _id: 'proId',
            $metadata: { permissions: { canInviteCustomers: true } },
          },
          promotionLots: { _id: 'pLotId', propertyLinks: [{ _id: 'prop' }] },
        },
      });
      // Force assignee to go to admin2
      UserService.update({
        userId: 'adminId',
        object: { roundRobinTimeout: 'Gone too' },
      });
      const { admin } = UserService.proInviteUser({
        user: {
          ...userToInvite,
          showAllLots: false,
          promotionLotIds: ['pLotId'],
        },
        promotionIds: ['promotionId'],
        proUserId: 'proId',
      });

      expect(admin._id).to.equal('admin2');
    });

    it('invites user to multiple promotions', () => {
      generator({
        promotions: [
          {
            _id: 'promotionId1',
            status: PROMOTION_STATUS.OPEN,
            assignedEmployeeId: 'adminId',
            users: {
              _id: 'proId',
              $metadata: { permissions: { canInviteCustomers: true } },
            },
            promotionLots: [{ _id: 'pL1' }],
          },
          {
            _id: 'promotionId2',
            status: PROMOTION_STATUS.OPEN,
            assignedEmployeeId: 'adminId',
            users: {
              _id: 'proId',
              $metadata: { permissions: { canInviteCustomers: true } },
            },
            promotionLotLinks: [{ _id: 'lotId2' }],
          },
        ],
      });

      UserService.proInviteUser({
        user: userToInvite,
        promotionIds: ['promotionId1', 'promotionId2'],
        proUserId: 'proId',
      });

      const userCreated = UserService.getByEmail(userToInvite.email, {
        assignedEmployeeId: 1,
        referredByUserLink: 1,
        referredByOrganisationLink: 1,
      });
      const loans = LoanService.fetch({
        $filters: { userId: userCreated._id },
        promotionLinks: 1,
      });

      expect(userCreated.assignedEmployeeId).to.equal('adminId');
      expect(userCreated.referredByUserLink).to.equal('proId');
      expect(userCreated.referredByOrganisationLink).to.equal('organisationId');
      expect(loans.length).to.equal(2);
      expect(loans[0].promotionLinks[0]._id).to.equal('promotionId1');
      expect(loans[0].promotionLinks[0].invitedBy).to.equal('proId');
      expect(loans[0].promotionLinks[0].showAllLots).to.equal(true);
      expect(loans[1].promotionLinks[0]._id).to.equal('promotionId2');
      expect(loans[1].promotionLinks[0].invitedBy).to.equal('proId');
      expect(loans[1].promotionLinks[0].showAllLots).to.equal(true);
    });

    it('throws if user is already invited to promotion', () => {
      generator({
        promotions: {
          _id: 'promotionId',
          status: PROMOTION_STATUS.OPEN,
          assignedEmployeeId: 'adminId',
          users: {
            _id: 'proId',
            $metadata: { permissions: { canInviteCustomers: true } },
          },
          promotionLots: [{ _id: 'pL1' }],
        },
      });

      UserService.proInviteUser({
        user: userToInvite,
        promotionIds: ['promotionId'],
        proUserId: 'proId',
      });

      expect(() =>
        UserService.proInviteUser({
          user: userToInvite,
          promotionIds: ['promotionId'],
          proUserId: 'proId',
        }),
      ).to.throw('Ce client est déjà invité à cette promotion');
    });

    it('invites user to pro property', async () => {
      generator({
        properties: {
          _id: 'propertyId',
          category: PROPERTY_CATEGORY.PRO,
          users: {
            _id: 'proId',
            $metadata: { permissions: { canInviteCustomers: true } },
          },
        },
      });

      await ddpWithUserId('proId', () =>
        proInviteUser.run({ user: userToInvite, propertyIds: ['propertyId'] }),
      );

      const userCreated = UserService.getByEmail(userToInvite.email, {
        assignedEmployeeId: 1,
        referredByUserLink: 1,
        referredByOrganisationLink: 1,
      });
      const loan = LoanService.get(
        { userId: userCreated._id },
        { propertyIds: 1 },
      );

      expect(userCreated.assignedEmployeeId).to.equal('adminId');
      expect(userCreated.referredByUserLink).to.equal('proId');
      expect(userCreated.referredByOrganisationLink).to.equal('organisationId');
      expect(loan.propertyIds[0]).to.equal('propertyId');

      const emails = await checkEmails(2);

      expect(
        !!emails.find(
          ({ emailId }) => emailId === EMAIL_IDS.INVITE_USER_TO_PROPERTY,
        ),
      ).to.equal(true);
      expect(
        !!emails.find(
          ({ emailId }) => emailId === EMAIL_IDS.CONFIRM_USER_INVITATION,
        ),
      ).to.equal(true);
    });

    it('invites user to multiple pro properties', () => {
      generator({
        properties: [
          {
            _id: 'propertyId1',
            category: PROPERTY_CATEGORY.PRO,
            users: {
              _id: 'proId',
              $metadata: { permissions: { canInviteCustomers: true } },
            },
          },
          {
            _id: 'propertyId2',
            category: PROPERTY_CATEGORY.PRO,
            users: {
              _id: 'proId',
              $metadata: { permissions: { canInviteCustomers: true } },
            },
          },
        ],
      });

      UserService.proInviteUser({
        user: userToInvite,
        propertyIds: ['propertyId1', 'propertyId2'],
        proUserId: 'proId',
      });
      const userCreated = UserService.getByEmail(userToInvite.email, {
        assignedEmployeeId: 1,
        referredByUserLink: 1,
        referredByOrganisationLink: 1,
      });
      const loan = LoanService.get(
        { userId: userCreated._id },
        { propertyIds: 1 },
      );

      expect(userCreated.assignedEmployeeId).to.equal('adminId');
      expect(userCreated.referredByUserLink).to.equal('proId');
      expect(userCreated.referredByOrganisationLink).to.equal('organisationId');
      expect(loan.propertyIds.length).to.equal(2);
      expect(loan.propertyIds[0]).to.equal('propertyId1');
      expect(loan.propertyIds[1]).to.equal('propertyId2');
    });

    it('invites user to multiple pro properties and promotions', () => {
      generator({
        properties: [
          {
            _id: 'propertyId1',
            category: PROPERTY_CATEGORY.PRO,
            users: {
              _id: 'proId',
              $metadata: { permissions: { canInviteCustomers: true } },
            },
          },
          {
            _id: 'propertyId2',
            category: PROPERTY_CATEGORY.PRO,
            users: {
              _id: 'proId',
              $metadata: { permissions: { canInviteCustomers: true } },
            },
          },
        ],
        promotions: [
          {
            _id: 'promotionId1',
            status: PROMOTION_STATUS.OPEN,
            assignedEmployeeId: 'adminId',
            users: {
              _id: 'proId',
              $metadata: { permissions: { canInviteCustomers: true } },
            },
            promotionLots: [{ _id: 'pL1' }],
          },
          {
            _id: 'promotionId2',
            status: PROMOTION_STATUS.OPEN,
            assignedEmployeeId: 'adminId',
            users: {
              _id: 'proId',
              $metadata: { permissions: { canInviteCustomers: true } },
            },
            promotionLotLinks: [{ _id: 'lotId2' }],
          },
        ],
      });

      UserService.proInviteUser({
        user: userToInvite,
        propertyIds: ['propertyId1', 'propertyId2'],
        promotionIds: ['promotionId1', 'promotionId2'],
        proUserId: 'proId',
      });

      const userCreated = UserService.getByEmail(userToInvite.email, {
        assignedEmployeeId: 1,
        referredByUserLink: 1,
        referredByOrganisationLink: 1,
      });
      const loans = LoanService.fetch({
        $filters: { userId: userCreated._id },
        promotionLinks: 1,
        propertyIds: 1,
      });

      expect(userCreated.assignedEmployeeId).to.equal('adminId');
      expect(userCreated.referredByUserLink).to.equal('proId');
      expect(userCreated.referredByOrganisationLink).to.equal('organisationId');
      expect(loans.length).to.equal(3);
      expect(loans[0].propertyIds.length).to.equal(2);
      expect(loans[0].propertyIds[0]).to.equal('propertyId1');
      expect(loans[0].propertyIds[1]).to.equal('propertyId2');
      expect(loans[1].promotionLinks[0]._id).to.equal('promotionId1');
      expect(loans[1].promotionLinks[0].invitedBy).to.equal('proId');
      expect(loans[2].promotionLinks[0]._id).to.equal('promotionId2');
      expect(loans[2].promotionLinks[0].invitedBy).to.equal('proId');
    });

    it('sends an invitation email', async () => {
      generator({
        properties: {
          address1: 'Rue du four 1',
          _id: 'propertyId2',
          category: PROPERTY_CATEGORY.PRO,
          users: {
            _id: 'proId',
            $metadata: { permissions: { canInviteCustomers: true } },
          },
        },
      });

      await ddpWithUserId('proId', () =>
        proInviteUser.run({ user: userToInvite, propertyIds: ['propertyId2'] }),
      );

      const emails = await checkEmails(2);

      expect(emails.length).to.equal(2);
      const {
        emailId,
        address,
        response: { status },
        template: {
          template_name,
          message: { from_email, subject, merge_vars, from_name },
        },
      } = emails.find(
        ({ emailId }) => emailId === EMAIL_IDS.INVITE_USER_TO_PROPERTY,
      );
      expect(status).to.equal('sent');
      expect(emailId).to.equal(EMAIL_IDS.INVITE_USER_TO_PROPERTY);
      expect(template_name).to.equal(
        EMAIL_TEMPLATES.NOTIFICATION_AND_CTA.mandrillId,
      );
      expect(address).to.equal('bob@dylan.com');
      expect(from_email).to.equal('team@e-potek.ch');
      expect(from_name).to.equal('e-Potek');
      expect(subject).to.equal('e-Potek - "Rue du four 1"');

      expect(
        emails.filter(
          ({ emailId }) => emailId === EMAIL_IDS.CONFIRM_USER_INVITATION,
        ).length,
      ).to.equal(1);
    });

    it('sends a promotion invitation email to the user', async () => {
      generator({
        promotions: {
          _id: 'promotionId',
          status: PROMOTION_STATUS.OPEN,
          assignedEmployeeId: 'adminId',
          users: {
            _id: 'proId',
            $metadata: { permissions: { canInviteCustomers: true } },
          },
          promotionLots: [{ _id: 'pL1' }],
        },
      });

      const { userId } = await ddpWithUserId('proId', () =>
        proInviteUser.run({
          user: userToInvite,
          promotionIds: ['promotionId'],
        }),
      );

      const emails = await checkEmails(2);

      const {
        services: {
          password: {
            reset: { token },
          },
        },
      } = UserService.get(userId, { services: 1 });

      expect(emails.length).to.equal(2);
      const emailIds = emails.map(({ emailId }) => emailId);
      expect(emailIds).to.include(EMAIL_IDS.INVITE_USER_TO_PROMOTION);
      expect(emailIds).to.include(EMAIL_IDS.CONFIRM_PROMOTION_USER_INVITATION);

      const {
        address,
        template: {
          template_name,
          message: { from_email, subject, global_merge_vars, from_name },
        },
      } = emails.find(
        ({ emailId }) => emailId === EMAIL_IDS.INVITE_USER_TO_PROMOTION,
      );
      const body = global_merge_vars.find(({ name }) => name === 'BODY')
        .content;
      const title = global_merge_vars.find(({ name }) => name === 'TITLE')
        .content;
      const ctaUrl = global_merge_vars.find(({ name }) => name === 'CTA_URL')
        .content;
      expect(address).to.equal(userToInvite.email);
      expect(template_name).to.equal(
        EMAIL_TEMPLATES.PROMOTION_INVITATION.mandrillId,
      );
      expect(from_email).to.equal('team@e-potek.ch');
      expect(from_name).to.equal('e-Potek');
      expect(subject).to.equal('Promotion immobilière Test promotion');
      expect(title).to.equal("Test promotion, Réservation d'un logement");
      expect(body).to.include('John Doe (bank)');
      expect(body).to.include('Admin User');
      expect(ctaUrl).to.include(`enroll-account/${token}`);
    });

    it('throws if user is already invited to pro property', () => {
      generator({
        properties: {
          _id: 'propertyId',
          category: PROPERTY_CATEGORY.PRO,
          users: {
            _id: 'proId',
            $metadata: { permissions: { canInviteCustomers: true } },
          },
        },
      });

      UserService.proInviteUser({
        user: userToInvite,
        propertyIds: ['propertyId'],
        proUserId: 'proId',
      });

      expect(() =>
        UserService.proInviteUser({
          user: userToInvite,
          propertyIds: ['propertyId'],
          proUserId: 'proId',
        }),
      ).to.throw('Ce client est déjà invité à ce bien immobilier');
    });

    it('invites existing users to a new promotion', () => {
      generator({
        users: {
          _id: 'userId',
          emails: [{ address: 'test@e-potek.ch', verified: true }],
        },
        promotions: {
          _id: 'promotionId',
          status: PROMOTION_STATUS.OPEN,
          assignedEmployeeId: 'adminId',
          users: {
            _id: 'proId',
            $metadata: { permissions: { canInviteCustomers: true } },
          },
          promotionLots: [{ _id: 'pL1' }],
        },
      });

      const { isNewUser, proId } = UserService.proInviteUser({
        user: {
          email: 'Test@e-potek.ch',
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '1234',
          showAllLots: false,
          promotionLotIds: [],
          invitedBy: 'proId',
        },
        promotionIds: ['promotionId'],
      });
      expect(isNewUser).to.equal(false);
      expect(proId).to.equal('proId');
      const { loans } = UserService.get('userId', { loans: { _id: 1 } });
      expect(loans.length).to.equal(1);
    });

    it('should send an email invite if it is done by an admin and the user exists already', async () => {
      generator({
        users: [
          {
            emails: [{ address: userToInvite.email, verified: true }],
            assignedEmployee: {
              _factory: ROLES.ADVISOR,
              _id: 'adminUser',
              firstName: 'Lydia',
              lastName: 'Abraha',
              organisations: { $metadata: { isMain: true } },
            },
          },
          {
            _factory: ROLES.PRO,
            _id: 'proUser',
            assignedEmployeeId: 'adminUser',
            organisations: { _id: 'organisation', $metadata: { isMain: true } },
            properties: {
              _id: 'proProperty',
              category: PROPERTY_CATEGORY.PRO,
              address1: 'Rue du parc 4',
            },
          },
        ],
      });

      await ddpWithUserId('adminUser', () =>
        proInviteUser.run({ user: userToInvite, propertyIds: ['proProperty'] }),
      );

      const emails = await checkEmails(1);

      expect(emails.length).to.equal(1);
      const [
        {
          emailId,
          address,
          response: { status },
          template: {
            template_name,
            message: { from_email, subject, global_merge_vars, from_name },
          },
        },
      ] = emails;
      expect(status).to.equal('sent');
      expect(emailId).to.equal(EMAIL_IDS.INVITE_USER_TO_PROPERTY);
      expect(template_name).to.equal(
        EMAIL_TEMPLATES.NOTIFICATION_AND_CTA.mandrillId,
      );
      expect(address).to.equal(userToInvite.email);
      expect(from_email).to.equal('team@e-potek.ch');
      expect(from_name).to.equal('e-Potek');
      expect(subject).to.equal('e-Potek - "Rue du parc 4"');
      expect(
        global_merge_vars.find(({ name }) => name === 'BODY').content,
      ).to.include('Lydia Abraha');
    });

    it('should send an email invite if it is done by an admin', async () => {
      generator({
        users: [
          {
            _factory: ROLES.ADVISOR,
            _id: 'adminUser',
            organisations: { $metadata: { isMain: true } },
          },
          {
            _factory: ROLES.PRO,
            _id: 'proUser',
            assignedEmployeeId: 'adminUser',
            organisations: { _id: 'organisation', $metadata: { isMain: true } },
            properties: {
              _id: 'proProperty3',
              category: PROPERTY_CATEGORY.PRO,
              address1: 'Rue du parc 5',
            },
          },
        ],
      });

      await ddpWithUserId('adminUser', () =>
        proInviteUser.run({
          user: userToInvite,
          propertyIds: ['proProperty3'],
        }),
      );

      const emails = await checkEmails(1);
      expect(emails.length).to.equal(1);
    });

    it('sets the right assignee to the user if it is a promotion', () => {
      generator({
        properties: { _id: 'prop' },
        promotions: {
          _id: 'promotionId',
          status: PROMOTION_STATUS.OPEN,
          assignedEmployeeId: 'adminId',
          users: {
            _id: 'proId',
            assignedEmployeeId: 'adminId3',
          },
          promotionLots: { _id: 'pLotId', propertyLinks: [{ _id: 'prop' }] },
        },
        users: { _id: 'adminId2' },
      });

      const { userId } = UserService.proInviteUser({
        user: {
          ...userToInvite,
          showAllLots: false,
          promotionLotIds: ['pLotId'],
        },
        promotionIds: ['promotionId'],
      });

      const { assignedEmployeeId } = UserService.get(userId, {
        assignedEmployeeId: 1,
      });
      expect(assignedEmployeeId).to.equal('adminId');
    });
  });
});
