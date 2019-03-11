import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random';

import { EMAIL_IDS } from 'core/api/email/emailConstants';
import LoanService from '../../loans/server/LoanService';
import CollectionService from '../../helpers/CollectionService';
import { fullUser } from '../../fragments';
import PropertyService from '../../properties/server/PropertyService';
import PromotionService from '../../promotions/server/PromotionService';
import SecurityService from '../../security';
import { getUserNameAndOrganisation } from '../../helpers';
import { ROLES } from '../userConstants';
import Users from '../users';

class UserService extends CollectionService {
  constructor() {
    super(Users);
  }

  get(userId) {
    return this.fetchOne({
      $filters: { _id: userId },
      ...fullUser(),
    });
  }

  createUser = ({ options, role }) => {
    const newUserId = Accounts.createUser(options);
    Roles.addUsersToRoles(newUserId, role);

    return newUserId;
  };

  adminCreateUser = ({
    options: { email, sendEnrollmentEmail, ...additionalData },
    role = ROLES.USER,
    adminId,
  }) => {
    const newUserId = this.createUser({ options: { email }, role });

    this.update({ userId: newUserId, object: additionalData });

    if (role === ROLES.USER && adminId && !additionalData.assignedEmployeeId) {
      this.assignAdminToUser({ userId: newUserId, adminId });
    }

    if (sendEnrollmentEmail) {
      this.sendEnrollmentEmail({ userId: newUserId });
    }

    return newUserId;
  };

  // This should remain a simple inequality check
  doesUserExist = ({ email }) => Accounts.findUserByEmail(email) != null;

  sendVerificationEmail = ({ userId }) =>
    Accounts.sendVerificationEmail(userId);

  sendEnrollmentEmail = ({ userId }) => {
    Accounts.sendEnrollmentEmail(userId);
  };

  // This is used to hook into Accounts
  onCreateUser = (options, user) => ({ ...user, roles: [ROLES.USER] });

  remove = ({ userId }) => Users.remove(userId);

  allowUpdate = ({ object }) => object && Object.keys(object).length !== 0;

  update = ({ userId, object }) =>
    this.allowUpdate({ object }) && Users.update(userId, { $set: object });

  assignAdminToUser = ({ userId, adminId }) =>
    adminId && this.update({ userId, object: { assignedEmployeeId: adminId } });

  getUsersByRole = role => Users.find({ roles: { $in: [role] } }).fetch();

  setRole = ({ userId, role }) => Roles.setUserRoles(userId, role);

  getUserById = ({ userId }) => Users.findOne(userId);

  getUserByPasswordResetToken = ({ token }) =>
    Users.findOne(
      { 'services.password.reset.token': token },
      { fields: { firstName: 1, lastName: 1, emails: 1 } },
    );

  testCreateUser = ({ user }) => Users.insert(user);

  hasPromotion = ({ userId, promotionId }) => {
    const loans = LoanService.fetch({
      $filters: { userId },
      promotionLinks: 1,
    });

    if (!promotionId) {
      // Return true if any promotion exists
      return (
        loans
        && loans.some(({ promotionLinks }) => promotionLinks && promotionLinks.length > 0)
      );
    }

    return (
      loans
      && loans.some(({ promotionLinks = [] }) =>
        promotionLinks.some(({ _id }) => _id === promotionId))
    );
  };

  hasProperty = ({ userId, propertyId }) => {
    if (!propertyId) {
      return false;
    }

    const loans = LoanService.fetch({
      $filters: { userId },
      propertyIds: 1,
    });

    return (
      loans
      && loans.some(({ propertyIds = [] }) =>
        propertyIds.some(id => id === propertyId))
    );
  };

  changeEmail = ({ userId, newEmail }) => {
    const { emails } = Users.findOne(userId);
    Accounts.addEmail(userId, newEmail);
    Accounts.removeEmail(userId, emails[0].address);
    Accounts.sendVerificationEmail(userId);
  };

  generateApiToken = ({ userId }) => {
    const apiToken = Random.id(24);
    return this._update({ id: userId, object: { apiToken }, operator: '$set' });
  };

  updateOrganisations = ({ userId, newOrganisations = [] }) => {
    const { organisations: oldOrganisations = [] } = this.get(userId);

    oldOrganisations.forEach(({ _id: organisationId }) =>
      this.removeLink({
        id: userId,
        linkName: 'organisations',
        linkId: organisationId,
      }));

    newOrganisations.forEach(({ _id: organisationId, metadata }) =>
      this.addLink({
        id: userId,
        linkName: 'organisations',
        linkId: organisationId,
        metadata,
      }));
  };

  testUserAccount = ({ email, password, role }) => {
    const userId = Accounts.createUser({ email, password });
    Roles.setUserRoles(userId, role);
    return this.get(userId);
  };

  proReferUser = ({ user, proUserId }) => {
    const { email, firstName, lastName, phoneNumber } = user;
    if (this.doesUserExist({ email })) {
      throw new Meteor.Error('Ce client a déjà été réferré');
    }

    const pro = this.fetchOne({
      $filters: { _id: proUserId },
      assignedEmployeeId: 1,
      name: 1,
      organisations: { name: 1 },
    });
    const {
      assignedEmployeeId: proAssignedEmployeeId,
      organisations = [],
    } = pro;
    const assignedEmployeeId = proAssignedEmployeeId;
    const organisationId = !!organisations.length && organisations[0]._id;
    const admin = this.get(assignedEmployeeId);

    const userId = this.adminCreateUser({
      options: {
        email,
        sendEnrollmentEmail: false,
        firstName,
        lastName,
        phoneNumbers: [phoneNumber],
      },
      adminId: admin && admin._id,
    });

    const loanId = LoanService.adminLoanInsert({ userId });

    this.addLink({
      id: userId,
      linkName: 'referredByUser',
      linkId: proUserId,
    });

    if (organisationId) {
      this.addLink({
        id: userId,
        linkName: 'referredByOrganisation',
        linkId: organisationId,
      });
    }

    return sendEmail.run({
      emailId: EMAIL_IDS.REFER_USER,
      userId,
      params: { proName: getUserNameAndOrganisation({ user: pro }) },
    });
  };

  proInviteUser = ({
    user,
    propertyId,
    promotionId,
    property,
    proUserId,
    referOnly,
  }) => {
    if (referOnly) {
      return this.proReferUser({ user, proUserId });
    }
    if (propertyId) {
      return PropertyService.inviteUser({
        proUserId,
        user,
        propertyId,
      });
    }
    if (promotionId) {
      return PromotionService.inviteUser({
        promotionId,
        user: { ...user, invitedBy: proUserId },
      });
    }
    if (property) {
      // Not yet implemented
    }

    throw new Meteor.Error('No property given');
  };

  getEnrollmentUrl({ userId }) {
    let domain = Meteor.settings.public.subdomains.app;

    if (SecurityService.hasRole(userId, ROLES.PRO)) {
      domain = Meteor.settings.public.subdomains.pro;
    }

    const { token } = Accounts.generateResetToken(
      userId,
      null,
      'enrollAccount',
    );
    return `${domain}/enroll-account/${token}`;
  }
}

export default new UserService();
