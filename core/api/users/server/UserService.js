import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';
import NodeRSA from 'node-rsa';
import omit from 'lodash/omit';

import { EMAIL_IDS } from '../../email/emailConstants';
import { sendEmail } from '../../methods';
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
    return this.fetchOne({ $filters: { _id: userId }, ...fullUser() });
  }

  getByEmail(email) {
    return Accounts.findUserByEmail(email);
  }

  createUser = ({ options, role }) => {
    if (!options.password) {
      // password is not even allowed to be undefined,
      // it has to be stripped from the options object
      options = omit(options, ['password']);
    }

    const newUserId = Accounts.createUser(options);

    if (role) {
      Roles.setUserRoles(newUserId, role);
    }

    return newUserId;
  };

  adminCreateUser = ({
    options: { email, password, sendEnrollmentEmail, ...additionalData },
    role = ROLES.USER,
    adminId,
  }) => {
    const newUserId = this.createUser({ options: { email, password }, role });

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
  doesUserExist = ({ email }) => this.getByEmail(email) != null;

  sendVerificationEmail = ({ userId }) =>
    Accounts.sendVerificationEmail(userId);

  sendEnrollmentEmail = ({ userId }) => {
    try {
      Accounts.sendEnrollmentEmail(userId);
    } catch (error) {
      // FIXME: Temporary fix for meteor toys in dev
      // https://github.com/MeteorToys/meteor-devtools/issues/111
      if (error.message !== 'MeteorToys is not defined') {
        throw error;
      }
    }
  };

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

  getLoginToken = ({ userId }) => {
    const user = Users.findOne(userId, { fields: { services: 1 } });

    return (
      user.services.password
      && user.services.password.reset
      && user.services.password.reset.token
    );
  };

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

  generateKeyPair = ({ userId }) => {
    const key = new NodeRSA();
    key.generateKeyPair(512);
    const publicKey = key
      .exportKey('pkcs1-public-pem')
      .replace(/\r?\n|\r/g, '');
    const privateKey = key
      .exportKey('pkcs1-private-pem')
      .replace(/\r?\n|\r/g, '');
    const createdAt = new Date();
    this._update({
      id: userId,
      object: { apiPublicKey: { publicKey, createdAt } },
    });
    return { publicKey, privateKey, createdAt };
  };

  proReferUser = ({ user, proUserId }) => {
    const { email } = user;
    if (this.doesUserExist({ email })) {
      throw new Meteor.Error("Ce client existe déjà. Vous ne pouvez pas le référer, mais vous pouvez l'inviter sur un de vos biens immobiliers.");
    }

    const { userId, pro } = this.proCreateUser({
      user,
      proUserId,
      sendInvitation: false,
    });

    LoanService.adminLoanInsert({ userId });

    return sendEmail.run({
      emailId: EMAIL_IDS.REFER_USER,
      userId,
      params: {
        proName: getUserNameAndOrganisation({ user: pro }),
        ctaUrl: this.getEnrollmentUrl({ userId }),
      },
    });
  };

  proCreateUser = ({
    user: { email, firstName, lastName, phoneNumber },
    proUserId,
    sendInvitation = true,
    adminId,
  }) => {
    let pro;
    let assignedEmployeeId;

    if (proUserId) {
      pro = this.fetchOne({
        $filters: { _id: proUserId },
        name: 1,
        assignedEmployeeId: 1,
        organisations: { name: 1 },
      });

      const { assignedEmployeeId: proAssignedEmployeeId } = pro;

      assignedEmployeeId = proAssignedEmployeeId;
    } else if (adminId) {
      assignedEmployeeId = adminId;
    }

    const isNewUser = !this.doesUserExist({ email });
    let userId;
    let admin;

    if (isNewUser) {
      admin = this.get(assignedEmployeeId);
      userId = this.adminCreateUser({
        options: {
          email,
          sendEnrollmentEmail: sendInvitation && !pro && Meteor.isProduction,
          firstName,
          lastName,
          phoneNumbers: [phoneNumber],
        },
        adminId: admin && admin._id,
      });

      if (pro) {
        this.setReferredBy({ userId, proId: proUserId });
      }
    } else {
      const {
        _id: existingUserId,
        assignedEmployeeId: existingAssignedEmployeeId,
      } = this.findOne({ 'emails.address': { $in: [email] } });
      admin = this.get(existingAssignedEmployeeId);
      userId = existingUserId;
    }

    return { userId, admin, pro, isNewUser };
  };

  proInviteUser = ({
    user,
    propertyIds = [],
    promotionIds = [],
    properties = [],
    proUserId,
    adminId,
  }) => {
    const referOnly = propertyIds.length === 0 && promotionIds.length === 0;
    if (referOnly) {
      return this.proReferUser({ user, proUserId });
    }

    if (!propertyIds && !promotionIds) {
      throw new Meteor.Error('No property given');
    }

    const { invitedBy } = user;
    const { userId, admin, pro, isNewUser } = this.proCreateUser({
      user,
      proUserId: proUserId || invitedBy,
      adminId,
    });

    let promises = [];

    if (propertyIds && propertyIds.length) {
      promises = [
        ...promises,
        PropertyService.inviteUser({
          propertyIds,
          admin,
          pro,
          userId,
          isNewUser,
        }),
      ];
    }
    if (promotionIds && promotionIds.length) {
      promises = [
        ...promises,
        ...promotionIds.map(promotionId =>
          PromotionService.inviteUser({
            promotionId,
            userId,
            pro,
            isNewUser,
            promotionLotIds: user.promotionLotIds,
            showAllLots: user.showAllLots,
          })),
      ];
    }
    if (properties && properties.length) {
      const internalPropertyIds = properties.map((property) => {
        let propertyId;

        const existingProperty = PropertyService.fetchOne({
          $filters: { externalId: property.externalId },
        });

        if (!existingProperty) {
          propertyId = PropertyService.insertExternalProperty({
            userId: pro._id,
            property,
          });
        } else {
          propertyId = existingProperty._id;
        }

        if (!propertyId) {
          throw new Meteor.Error('No property found');
        }

        return propertyId;
      });

      promises = [
        ...promises,
        PropertyService.inviteUser({
          propertyIds: internalPropertyIds,
          admin,
          pro,
          userId,
          isNewUser,
        }),
      ];
    }

    return Promise.all(promises);
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

  setReferredBy({ userId, proId }) {
    const { organisations = [] } = this.fetchOne({
      $filters: { _id: proId },
      organisations: { _id: 1 },
    });
    const organisationId = organisations.length ? organisations[0]._id : null;
    return this.update({
      userId,
      object: {
        referredByUserLink: proId,
        referredByOrganisationLink: organisationId,
      },
    });
  }

  setReferredByOrganisation({ userId, organisationId }) {
    return this.update({
      userId,
      object: { referredByOrganisationLink: organisationId },
    });
  }

  proInviteUserToOrganisation({ user, organisationId, title, proId, adminId }) {
    const { email, phoneNumber } = user;
    let assigneeId;

    if (this.doesUserExist({ email })) {
      throw new Meteor.Error('Cet utilisateur existe déjà');
    }

    if (proId) {
      const { assignedEmployeeId } = this.fetchOne({
        $filters: { _id: proId },
        assignedEmployeeId: 1,
      });
      assigneeId = assignedEmployeeId;
    } else {
      assigneeId = adminId;
    }

    const userId = this.adminCreateUser({
      options: {
        ...user,
        phoneNumbers: [phoneNumber],
        sendEnrollmentEmail: !Meteor.isDevelopment, // Meteor toys is not defined
      },
      role: ROLES.PRO,
      adminId: assigneeId,
    });

    this.addLink({
      id: userId,
      linkName: 'organisations',
      linkId: organisationId,
      metadata: { title },
    });

    return userId;
  }
}

export default new UserService();
