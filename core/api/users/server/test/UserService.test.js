/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { checkEmails } from '../../../../utils/testHelpers';
import LoanService from '../../../loans/server/LoanService';
import BorrowerService from '../../../borrowers/server/BorrowerService';
import PropertyService from '../../../properties/server/PropertyService';
import generator from '../../../factories';
import { PROMOTION_STATUS } from '../../../promotions/promotionConstants';
import { PROPERTY_CATEGORY } from '../../../properties/propertyConstants';
import { EMAIL_IDS, EMAIL_TEMPLATES } from '../../../email/emailConstants';
import { ROLES } from '../../userConstants';
import UserService, { UserServiceClass } from '../UserService';

describe('UserService', function () {
  this.timeout(10000);

  const firstName = 'testFirstName';
  const lastName = 'testLastName';
  let user;

  beforeEach(() => {
    resetDatabase();

    user = Factory.create('user', { firstName, lastName });
    sinon.stub(UserService, 'sendEnrollmentEmail').callsFake(() => { });
  });

  afterEach(() => {
    UserService.sendEnrollmentEmail.restore();
  });

  describe('createUser', () => {
    it('creates a user with a USER role by default', () => {
      const options = { email: 'test@test.com' };
      const userId = UserService.createUser({ options });
      user = UserService.getUserById({ userId });

      expect(user.roles).to.deep.equal([ROLES.USER]);
    });

    it('creates a user with a PRO role', () => {
      const options = { email: 'test@test.com' };
      const userId = UserService.createUser({ options, role: ROLES.PRO });
      user = UserService.getUserById({ userId });

      expect(user.roles).to.deep.equal([ROLES.PRO]);
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
    it('updates a user: check the sentence case', () => {
      const newFirstName = 'jon';
      UserService.update({
        userId: user._id,
        object: { firstName: newFirstName },
      });
      expect(UserService.getUserById({ userId: user._id }).firstName).to.equal('Jon');
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

  describe('toggle account', () => {
    it('toggle account', () => {
      UserService.toggleAccount({
        userId: user._id,
      });
      expect(UserService.getUserById({ userId: user._id }).isDisabled).to.not.equal(user.isDisabled);
    });
    it('Throw error if userId is not defined', () => {
      expect(() =>
        UserService.toggleAccount({}))
        .to.throw('Valeur invalide');
    });
    it('Throw error if user not found', () => {
      expect(() =>
        UserService.toggleAccount({ userId: 'yqweuqwheiqweqiwei' }))
        .to.throw('Utilisateur non trouvé');
  });
});

describe('remove', () => {
  it('removes a user', () => {
    expect(UserService.getUserById({ userId: user._id })).to.deep.equal(user);
    UserService.remove({ userId: user._id });
    expect(UserService.getUserById({ userId: user._id })).to.equal(undefined);
  });

  it('autoremoves all loans, properties and borrowers', () => {
    Factory.create('loan', { userId: user._id });
    Factory.create('loan', { userId: user._id });
    Factory.create('borrower', { userId: user._id });
    Factory.create('borrower', { userId: user._id });
    Factory.create('property', { userId: user._id });
    Factory.create('property', { userId: user._id });
    UserService.remove({ userId: user._id });
    expect(UserService.getUserById({ userId: user._id })).to.equal(undefined);
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

  describe('getUserByPasswordResetToken', () => {
    it('returns a user if found', () => {
      const token = 'testToken';
      UserService.testCreateUser({
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
          phoneNumbers: ['phoneNumber'],
          username: 'secretUsername',
        },
      });
      expect(UserService.getUserByPasswordResetToken({ token })).to.deep.equal({
        _id: userId,
        firstName,
        lastName,
        email: 'yo@dude.com',
        emails: [{ address: 'yo@dude.com', verified: false }],
        name: 'testFirstName testLastName',
        phoneNumbers: ['phoneNumber'],
        services: { password: { reset: { token } } },
      });
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
        { _id: 'adminId', _factory: 'admin' },
        {
          _id: 'proId',
          assignedEmployeeId: 'adminId',
          organisations: { _id: 'organisationId', name: 'bank' },
          _factory: 'pro',
          firstName: 'John',
          lastName: 'Doe',
          emails: [{ address: 'john@doe.com', verified: true }],
        },
      ],
    });
  });

  it('invites user to refer only', () =>
    UserService.proInviteUser({
      user: userToInvite,
      referOnly: true,
      proUserId: 'proId',
    }).then(() => {
      const userCreated = UserService.getByEmail(userToInvite.email);

      expect(userCreated.assignedEmployeeId).to.equal('adminId');
      expect(userCreated.referredByUserLink).to.equal('proId');
      expect(userCreated.referredByOrganisationLink).to.equal('organisationId');

      return checkEmails(2).then((emails) => {
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
        expect(template_name).to.equal(EMAIL_TEMPLATES.NOTIFICATION_AND_CTA.mandrillId);
        expect(address).to.equal('bob@dylan.com');
        expect(from_email).to.equal('info@e-potek.ch');
        expect(from_name).to.equal('e-Potek');
        expect(subject).to.equal('Vous avez été invité sur e-Potek');
        expect(global_merge_vars.find(({ name }) => name === 'BODY').content).to.include('John Doe (bank)');
        {
          const {
            emailId,
            address,
            response: { status },
            template: {
              template_name,
              message: { from_email, subject, global_merge_vars, from_name },
            },
          } = emails.find(({ emailId }) => emailId === EMAIL_IDS.CONFIRM_USER_INVITATION);
          expect(status).to.equal('sent');
          expect(emailId).to.equal(EMAIL_IDS.CONFIRM_USER_INVITATION);
          expect(template_name).to.equal(EMAIL_TEMPLATES.NOTIFICATION_AND_CTA.mandrillId);
          expect(address).to.equal('john@doe.com');
          expect(from_email).to.equal('info@e-potek.ch');
          expect(from_name).to.equal('e-Potek');
          expect(subject).to.equal('Invitation réussie');
          expect(global_merge_vars.find(({ name }) => name === 'BODY').content).to.include('Bob Dylan (bob@dylan.com)');
        }
      });
    }));

  it('throws if user already exists and it is referOnly', () => {
    generator({
      users: { emails: [{ address: userToInvite.email, verified: false }] },
    });

    expect(() =>
      UserService.proInviteUser({
        user: userToInvite,
        referOnly: true,
        proUserId: 'proId',
      })).to.throw('Ce client existe déjà');
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

    return UserService.proInviteUser({
      user: {
        ...userToInvite,
        showAllLots: false,
        promotionLotIds: ['pLotId'],
      },
      promotionIds: ['promotionId'],
      proUserId: 'proId',
    }).then(() => {
      const userCreated = UserService.getByEmail(userToInvite.email);
      const loan = LoanService.findOne({ userId: userCreated._id });

      expect(userCreated.assignedEmployeeId).to.equal('adminId');
      expect(userCreated.referredByUserLink).to.equal('proId');
      expect(userCreated.referredByOrganisationLink).to.equal('organisationId');
      expect(loan.promotionLinks[0]._id).to.equal('promotionId');
      expect(loan.promotionLinks[0].invitedBy).to.equal('proId');
      expect(loan.promotionLinks[0].showAllLots).to.equal(false);
      expect(loan.promotionOptionLinks.length).to.equal(1);

      return checkEmails(2);
    });
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

    return UserService.proInviteUser({
      user: userToInvite,
      promotionIds: ['promotionId1', 'promotionId2'],
      proUserId: 'proId',
    }).then(() => {
      const userCreated = UserService.getByEmail(userToInvite.email);
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

      return checkEmails(4);
    });
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
      },
    });

    return UserService.proInviteUser({
      user: userToInvite,
      promotionIds: ['promotionId'],
      proUserId: 'proId',
    })
      .then(() => checkEmails(2))
      .then((emails) => {
        expect(() =>
          UserService.proInviteUser({
            user: userToInvite,
            promotionIds: ['promotionId'],
            proUserId: 'proId',
          })).to.throw('Ce client est déjà invité à cette promotion');
      });
  });

  it('invites user to pro property', () => {
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

    return UserService.proInviteUser({
      user: userToInvite,
      propertyIds: ['propertyId'],
      proUserId: 'proId',
    }).then(() => {
      const userCreated = UserService.getByEmail(userToInvite.email);
      const loan = LoanService.findOne({ userId: userCreated._id });

      expect(userCreated.assignedEmployeeId).to.equal('adminId');
      expect(userCreated.referredByUserLink).to.equal('proId');
      expect(userCreated.referredByOrganisationLink).to.equal('organisationId');
      expect(loan.propertyIds[0]).to.equal('propertyId');

      return checkEmails(2).then((emails) => {
        expect(!!emails.find(({ emailId }) => emailId === EMAIL_IDS.INVITE_USER_TO_PROPERTY)).to.equal(true);
        expect(!!emails.find(({ emailId }) => emailId === EMAIL_IDS.CONFIRM_USER_INVITATION)).to.equal(true);
      });
    });
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

    return UserService.proInviteUser({
      user: userToInvite,
      propertyIds: ['propertyId1', 'propertyId2'],
      proUserId: 'proId',
    }).then(() => {
      const userCreated = UserService.getByEmail(userToInvite.email);
      const loan = LoanService.findOne({ userId: userCreated._id });

      expect(userCreated.assignedEmployeeId).to.equal('adminId');
      expect(userCreated.referredByUserLink).to.equal('proId');
      expect(userCreated.referredByOrganisationLink).to.equal('organisationId');
      expect(loan.propertyIds.length).to.equal(2);
      expect(loan.propertyIds[0]).to.equal('propertyId1');
      expect(loan.propertyIds[1]).to.equal('propertyId2');

      return checkEmails(2);
    });
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

    return UserService.proInviteUser({
      user: userToInvite,
      propertyIds: ['propertyId1', 'propertyId2'],
      promotionIds: ['promotionId1', 'promotionId2'],
      proUserId: 'proId',
    }).then(() => {
      const userCreated = UserService.getByEmail(userToInvite.email);
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

      return checkEmails(6);
    });
  });

  it('sends an invitation email', () => {
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

    return UserService.proInviteUser({
      user: userToInvite,
      propertyIds: ['propertyId2'],
      proUserId: 'proId',
    })
      .then(() => checkEmails(2))
      .then((emails) => {
        expect(emails.length).to.equal(2);
        const {
          emailId,
          address,
          response: { status },
          template: {
            template_name,
            message: { from_email, subject, merge_vars, from_name },
          },
        } = emails.find(({ emailId }) => emailId === EMAIL_IDS.INVITE_USER_TO_PROPERTY);
        expect(status).to.equal('sent');
        expect(emailId).to.equal(EMAIL_IDS.INVITE_USER_TO_PROPERTY);
        expect(template_name).to.equal(EMAIL_TEMPLATES.NOTIFICATION_AND_CTA.mandrillId);
        expect(address).to.equal('bob@dylan.com');
        expect(from_email).to.equal('info@e-potek.ch');
        expect(from_name).to.equal('e-Potek');
        expect(subject).to.equal('e-Potek - "Rue du four 1"');

        expect(emails.filter(({ emailId }) => emailId === EMAIL_IDS.CONFIRM_USER_INVITATION).length).to.equal(1);
      });
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

    return UserService.proInviteUser({
      user: userToInvite,
      propertyIds: ['propertyId'],
      proUserId: 'proId',
    })
      .then(() => checkEmails(2))
      .then(() => {
        expect(() =>
          UserService.proInviteUser({
            user: userToInvite,
            propertyIds: ['propertyId'],
            proUserId: 'proId',
          })).to.throw('Ce client est déjà invité à ce bien immobilier');
      });
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
      },
    });

    return UserService.proInviteUser({
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
      proUserId: 'proId',
      adminId: 'adminId',
    }).then(() => {
      const { loans } = UserService.fetchOne({
        $filters: { _id: 'userId' },
        loans: { _id: 1 },
      });
      expect(loans.length).to.equal(1);

      return checkEmails(2);
    });
  });
});

describe('round robin', () => {
  const employees = ['a@e-potek.ch', 'b@e-potek.ch', 'c@e-potek.ch'];
  let employeeIds = [];

  beforeEach(() => {
    employeeIds = employees.map(email =>
      UserService.adminCreateUser({ options: { email }, role: ROLES.ADMIN }));
  });

  it('sets the first user to the first in the array', () => {
    const service = new UserServiceClass({
      employees,
    });

    const newUserId = service.adminCreateUser({
      options: { email: '1@e-potek.ch' },
    });

    const { assignedEmployee } = service.fetchOne({
      $filters: { _id: newUserId },
      assignedEmployee: { email: 1 },
    });

    expect(assignedEmployee.email).to.equal(employees[0]);
  });

  it('sets the second user to the second in the array', () => {
    const service = new UserServiceClass({
      employees,
    });

    service.adminCreateUser({
      options: { email: '1@e-potek.ch' },
    });

    const newUserId2 = service.adminCreateUser({
      options: { email: '2@e-potek.ch' },
    });

    const { assignedEmployee } = service.fetchOne({
      $filters: { _id: newUserId2 },
      assignedEmployee: { email: 1 },
    });

    expect(assignedEmployee.email).to.equal(employees[1]);
  });

  it('loops back to first in array', () => {
    const service = new UserServiceClass({
      employees,
    });

    generator({
      users: { assignedEmployeeId: employeeIds[2], _factory: 'user' },
    });

    const newUserId = service.adminCreateUser({
      options: { email: '1@e-potek.ch' },
    });

    const { assignedEmployee } = service.fetchOne({
      $filters: { _id: newUserId },
      assignedEmployee: { email: 1 },
    });

    expect(assignedEmployee.email).to.equal(employees[0]);
  });

  it('ignores users assigned to people outside of employees list, and check latest one', () => {
    const service = new UserServiceClass({
      employees,
    });

    generator({
      users: [
        { _id: 'a', assignedEmployeeId: employeeIds[2], _factory: 'user' },
        { _id: 'b', assignedEmployeeId: employeeIds[2], _factory: 'user' },
        { _id: 'c', assignedEmployeeId: employeeIds[2], _factory: 'user' },
        { _id: 'd', assignedEmployeeId: employeeIds[1], _factory: 'user' },
        { _id: 'e', assignedEmployee: { _id: 'adminId', _factory: 'admin' } },
      ],
    });

    const newUserId = service.adminCreateUser({
      options: { email: '1@e-potek.ch' },
    });

    const { assignedEmployee } = service.fetchOne({
      $filters: { _id: newUserId },
      assignedEmployee: { email: 1 },
    });

    expect(assignedEmployee.email).to.equal(employees[2]);
  });
});
});
