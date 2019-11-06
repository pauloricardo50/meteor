import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';
import NodeRSA from 'node-rsa';
import omit from 'lodash/omit';

import { EMAIL_IDS } from '../../email/emailConstants';
import { sendEmail } from '../../methods';
import { fullUser } from '../../fragments';
import CollectionService from '../../helpers/CollectionService';
import LoanService from '../../loans/server/LoanService';
import PropertyService from '../../properties/server/PropertyService';
import PromotionService from '../../promotions/server/PromotionService';
import OrganisationService from '../../organisations/server/OrganisationService';
import SecurityService from '../../security';
import { getUserNameAndOrganisation } from '../../helpers';
import { ROLES } from '../userConstants';
import roundRobinAdvisors from './roundRobinAdvisors';
import Users from '../users';

export class UserServiceClass extends CollectionService {
  constructor({ employees }) {
    super(Users);
    this.setupRoundRobin(employees);
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

    if (additionalData.phoneNumber && additionalData.phoneNumber.length) {
      additionalData.phoneNumbers = [additionalData.phoneNumber];
    }

    this.update({ userId: newUserId, object: additionalData });

    if (role === ROLES.USER && adminId && !additionalData.assignedEmployeeId) {
      this.assignAdminToUser({ userId: newUserId, adminId });
    } else if (!additionalData.assignedEmployeeId) {
      this.setAssigneeForNewUser(newUserId);
    }

    if (sendEnrollmentEmail) {
      this.sendEnrollmentEmail({ userId: newUserId });
    }

    return newUserId;
  };

  anonymousCreateUser = ({ user, loanId, referralId }) => {
    const userId = this.adminCreateUser({
      options: { ...user, sendEnrollmentEmail: true },
    });

    if (loanId) {
      LoanService.assignLoanToUser({ userId, loanId });
    }

    if (referralId) {
      const referralUser = this.fetchOne({
        $filters: { _id: referralId, roles: { $in: [ROLES.PRO] } },
      });
      const referralOrg = OrganisationService.fetchOne({
        $filters: {
          _id: referralId,
        },
      });
      if (referralUser) {
        this.setReferredBy({ userId, proId: referralId });
      } else if (referralOrg) {
        this.setReferredByOrganisation({
          userId,
          organisationId: referralId,
        });
      }
    }

    return userId;
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

  assignAdminToUser = ({ userId, adminId }) => {
    if (adminId) {
      const { assignedEmployee: oldAssignee = {} } = this.fetchOne({
        $filters: { _id: userId },
        assignedEmployee: { name: 1 },
      }) || {};
      const newAssignee = this.fetchOne({ $filters: { _id: adminId }, name: 1 }) || {};

      this.update({ userId, object: { assignedEmployeeId: adminId } });
      return { oldAssignee, newAssignee };
    }
  };

  getUsersByRole = (role) => Users.find({ roles: { $in: [role] } }).fetch();

  setRole = ({ userId, role }) => Roles.setUserRoles(userId, role);

  getUserById = ({ userId }) => Users.findOne(userId);

  getUserByPasswordResetToken = ({ token }) =>
    this.fetchOne({
      $filters: { 'services.password.reset.token': token },
      email: 1,
      emails: 1,
      firstName: 1,
      lastName: 1,
      name: 1,
      phoneNumbers: 1,
    });

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
        propertyIds.some((id) => id === propertyId))
    );
  };

  changeEmail = ({ userId, newEmail }) => {
    const { emails } = Users.findOne(userId);
    Accounts.addEmail(userId, newEmail);
    Accounts.removeEmail(userId, emails[0].address);
    Accounts.sendVerificationEmail(userId);
    return { oldEmail: emails[0].address, newEmail };
  };

  updateOrganisations = ({ userId, newOrganisations = [] }) => {
    const duplicateOrganisations = newOrganisations
      .map(({ _id }) => _id)
      .filter((value, index, self) => self.indexOf(value) === index)
      .length !== newOrganisations.length;

    if (duplicateOrganisations) {
      throw new Meteor.Error('Vous ne pouvez pas lier un compte deux fois à la même organisation.');
    }
    const { organisations: oldOrganisations = [] } = this.get(userId);

    oldOrganisations.forEach(({ _id: organisationId }) =>
      this.removeLink({
        id: userId,
        linkName: 'organisations',
        linkId: organisationId,
      }));

    newOrganisations.forEach(({ _id: organisationId, metadata }) =>
      this.linkOrganisation({ userId, organisationId, metadata }));
  };

  testUserAccount = ({ email, password, role }) => {
    if (this.doesUserExist({ email })) {
      // Sometimes this methods is called twice from a test.....???????
      // Apparently due to a duplicate websocket connection
      return this.getByEmail(email);
    }
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

  proReferUser = ({ user, proUserId, shareSolvency }) => {
    const { email } = user;
    if (this.doesUserExist({ email })) {
      throw new Meteor.Error("Ce client existe déjà. Vous ne pouvez pas le référer, mais vous pouvez l'inviter sur un de vos biens immobiliers.");
    }

    const { userId, pro, admin } = this.proCreateUser({
      user,
      proUserId,
      sendInvitation: false,
    });

    const loanId = LoanService.fullLoanInsert({ userId });
    LoanService.update({ loanId, object: { shareSolvency } });

    return sendEmail
      .run({
        emailId: EMAIL_IDS.REFER_USER,
        userId,
        params: {
          proUserId,
          proName: getUserNameAndOrganisation({ user: pro }),
          ctaUrl: this.getEnrollmentUrl({ userId }),
        },
      })
      .then(() => ({ userId, isNewUser: true }));
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
      } = this.getByEmail(email);

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
    shareSolvency,
  }) => {
    const referOnly = propertyIds.length === 0
      && promotionIds.length === 0
      && properties.length === 0;

    if (referOnly) {
      return this.proReferUser({ user, proUserId, shareSolvency });
    }

    const { invitedBy } = user;
    const { userId, admin, pro, isNewUser } = this.proCreateUser({
      user,
      proUserId: proUserId || invitedBy,
      adminId,
      // Invitation will be sent by the propertyInvitationEmail or
      // promotionInvitationEmail
      sendInvitation: false,
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
          shareSolvency,
        }),
      ];
    }
    if (promotionIds && promotionIds.length) {
      promises = [
        ...promises,
        ...promotionIds.map((promotionId) =>
          PromotionService.inviteUser({
            promotionId,
            userId,
            pro,
            isNewUser,
            promotionLotIds: user.promotionLotIds,
            showAllLots: user.showAllLots,
            shareSolvency,
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
          shareSolvency,
        }),
      ];
    }

    return Promise.all(promises).then(() => ({ userId, isNewUser: false }));
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

  setReferredBy({ userId, proId, organisationId }) {
    const { referredByUser: oldReferral } = this.fetchOne({
      $filters: { _id: userId },
      referredByUser: { name: 1, organisations: { name: 1 } },
    });

    if (!proId) {
      this._update({
        id: userId,
        object: { referredByUserLink: true },
        operator: '$unset',
      });

      return {
        oldReferral,
        referralType: 'user',
      };
    }
    if (!organisationId) {
      const mainOrg = this.getUserMainOrganisation(proId);
      organisationId = mainOrg && mainOrg._id;
    }

    const newReferral = this.fetchOne({
      $filters: { _id: proId },
      name: 1,
      organisations: { name: 1 },
    });

    this.update({
      userId,
      object: {
        referredByUserLink: proId,
        referredByOrganisationLink: organisationId,
      },
    });

    return {
      oldReferral,
      newReferral,
      referralType: 'user',
    };
  }

  setReferredByOrganisation({ userId, organisationId }) {
    const { referredByOrganisation: oldReferral = {} } = this.fetchOne({
      $filters: { _id: userId },
      referredByOrganisation: { name: 1 },
    });
    if (!organisationId) {
      this._update({
        id: userId,
        object: { referredByOrganisationLink: true },
        operator: '$unset',
      });
      return { oldReferral, referralType: 'org' };
    }
    const newReferral = OrganisationService.fetchOne({
      $filters: { _id: organisationId },
      name: 1,
    });
    this.update({
      userId,
      object: { referredByOrganisationLink: organisationId },
    });
    return { oldReferral, newReferral, referralType: 'org' };
  }

  proInviteUserToOrganisation({ user, organisationId, title, proId, adminId }) {
    const { email, phoneNumber } = user;
    let assigneeId;

    if (this.doesUserExist({ email })) {
      throw new Meteor.Error('Ce compte existe déjà');
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

    this.linkOrganisation({ userId, organisationId, metadata: { title } });

    return userId;
  }

  linkOrganisation({ userId, organisationId, metadata }) {
    const { organisations: userOrganisations = [] } = this.fetchOne({
      $filters: { _id: userId },
      organisations: { _id: 1 },
    });
    const isMain = userOrganisations.length === 0;

    this.addLink({
      id: userId,
      linkName: 'organisations',
      linkId: organisationId,
      metadata: { ...metadata, isMain },
    });
  }

  getMainOrg({ organisations, getIsMain }) {
    let mainOrganisation;
    if (organisations.length === 1) {
      mainOrganisation = organisations[0];
    } else if (organisations.length > 1) {
      mainOrganisation = organisations.find(getIsMain) || organisations[0];
    }

    return mainOrganisation;
  }

  getUserMainOrganisation(userId) {
    const organisations = OrganisationService.fetch({
      $filters: { userLinks: { $elemMatch: { _id: userId } } },
      userLinks: 1,
      name: 1,
    });

    return this.getMainOrg({
      organisations,
      getIsMain: ({ userLinks }) =>
        userLinks.find(({ _id }) => _id === userId).isMain,
    });
  }

  getMainUsersOfOrg({ userId, orgId }) {
    if (!!userId === !!orgId) {
      throw new Meteor.Error('You should provide exactly one of "userId" or "orgId" to "getMainUsersOfOrg"');
    }

    const query = { users: { organisations: { _id: 1 } } };
    const organisations = OrganisationService.fetch({
      $filters: { userLinks: { $elemMatch: { _id: userId } } },
      ...query,
    });

    let mainOrganisation;

    if (orgId) {
      mainOrganisation = OrganisationService.fetchOne({
        $filters: { _id: orgId },
        ...query,
      });
    } else {
      mainOrganisation = this.getMainOrg({
        organisations,
        getIsMain: ({ users }) =>
          users.find(({ _id }) => _id === userId).$metadata.isMain,
      });
    }

    if (!mainOrganisation) {
      return {};
    }

    // Only return users for whom this organisation is their main org
    const users = mainOrganisation.users.filter(({ $metadata, organisations: userOrganisations }) => {
      if ($metadata.isMain || userOrganisations.length === 1) {
        return true;
      }
    });

    return { organisation: mainOrganisation, users };
  }

  proSetShareCustomers({ userId, organisationId, shareCustomers }) {
    this.updateLinkMetadata({
      id: userId,
      linkName: 'organisations',
      linkId: organisationId,
      metadata: { shareCustomers },
    });
  }

  setupRoundRobin(employees = []) {
    this.employees = employees
      .map((email) => {
        const employee = this.getByEmail(email);
        if (employee) {
          return employee._id;
        }
      })
      .filter((x) => x);
  }

  setAssigneeForNewUser(userId) {
    const { roles, assignedEmployeeId } = this.fetchOne({
      $filters: { _id: userId },
      assignedEmployeeId: 1,
      roles: 1,
    });

    if (assignedEmployeeId) {
      return;
    }
    let newAssignee;

    if (roles.includes(ROLES.USER)) {
      const lastCreatedUser = this.fetchOne({
        $filters: {
          roles: ROLES.USER,
          assignedEmployeeId: { $in: this.employees },
        },
        $options: { sort: { createdAt: -1 } },
        assignedEmployeeId: 1,
        createdAt: 1,
      });

      if (lastCreatedUser && lastCreatedUser.assignedEmployeeId) {
        const index = this.employees.indexOf(lastCreatedUser.assignedEmployeeId);
        if (index >= this.employees.length - 1) {
          newAssignee = this.employees[0];
        } else {
          newAssignee = this.employees[index + 1];
        }
      } else {
        // Assign the very first user
        newAssignee = this.employees[0];
      }
    }

    return this.update({ userId, object: { assignedEmployeeId: newAssignee } });
  }

  getReferral(userId) {
    const { referredByUser, referredByOrganisation } = this.fetchOne({
      $filters: { _id: userId },
      referredByUser: { name: 1 },
      referredByOrganisation: { name: 1 },
    });

    // If the referredByUser is not in the organisation referredByOrganisation,
    // this could return inaccurate data. Make sure you understand what this does
    if (referredByUser) {
      const { _id: proId } = referredByUser;
      const mainOrg = this.getUserMainOrganisation(proId);
      return { user: referredByUser, organisation: mainOrg || {} };
    }

    return { organisation: referredByOrganisation || {}, user: {} };
  }

  // May be we can replace one of our existing method or keep this one here?
  getUserDetails(userId) {
    if (typeof userId === 'string') {
      const user = this.get(userId);
      if (!(user && typeof user)) {
        throw new Meteor.Error('Utilisateur non trouvé');
      }
      return user;
    }
    throw new Meteor.Error('Valeur invalide');
  }

  toggleAccount({ userId }) {
    const userDetails = this.getUserDetails(userId);
    const { isDisabled } = userDetails;
    const nextValue = !isDisabled;
    this.update({
      userId,
      object: { isDisabled: nextValue, 'services.resume.loginTokens': [] },
    });
    return nextValue;
  }
}

export default new UserServiceClass({ employees: roundRobinAdvisors });
