import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';

import NodeRSA from 'node-rsa';
import omit from 'lodash/omit';

import { fullUser } from 'core/api/fragments';
import { selectorForFastCaseInsensitiveLookup } from 'core/api/helpers/server/mongoServerHelpers';
import CollectionService from '../../helpers/server/CollectionService';
import LoanService from '../../loans/server/LoanService';
import PropertyService from '../../properties/server/PropertyService';
import PromotionService from '../../promotions/server/PromotionService';
import OrganisationService from '../../organisations/server/OrganisationService';
import SecurityService from '../../security';
import { ROLES, ACQUISITION_CHANNELS } from '../userConstants';
import Users from '../users';
import roundRobinAdvisors from './roundRobinAdvisors';
import { getAPIUser } from '../../RESTAPI/server/helpers';

export class UserServiceClass extends CollectionService {
  constructor({ employees }) {
    super(Users);
    this.setupRoundRobin(employees);
  }

  getByEmail(email, fragment = {}, additionalFilters = {}) {
    let user = null;
    const mergedFragment = { _id: 1, ...fragment };
    user = this.get(
      { 'emails.address': email, ...additionalFilters },
      mergedFragment,
    );

    if (!user) {
      const filters = selectorForFastCaseInsensitiveLookup(
        'emails.address',
        email,
      );
      const candidateUsers = this.fetch({
        $filters: { ...filters, ...additionalFilters },
        ...mergedFragment,
      });
      if (candidateUsers.length === 1) {
        user = candidateUsers[0];
      }
    }

    return user;
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
    options: {
      email,
      password,
      sendEnrollmentEmail,
      referredByUserId,
      referredByOrganisation,
      ...additionalData
    },
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

    if (referredByUserId) {
      this.setReferredBy({ userId: newUserId, proId: referredByUserId });
    }
    if (referredByOrganisation) {
      this.setReferredByOrganisation({
        userId: newUserId,
        organisationId: referredByOrganisation._id,
      });
    }

    const APIUser = getAPIUser();

    if (APIUser) {
      this.update({
        userId: newUserId,
        object: { acquisitionChannel: ACQUISITION_CHANNELS.REFERRAL_API },
      });
    } else if (referredByUserId || referredByOrganisation) {
      const userReferral =
        referredByUserId && this.get(referredByUserId, { roles: 1 });
      const isReferralAdmin =
        userReferral &&
        (Roles.userIsInRole(userReferral, ROLES.ADMIN) ||
          Roles.userIsInRole(userReferral, ROLES.DEV));

      this.update({
        userId: newUserId,
        object: {
          acquisitionChannel: isReferralAdmin
            ? ACQUISITION_CHANNELS.REFERRAL_ADMIN
            : ACQUISITION_CHANNELS.REFERRAL_PRO,
        },
      });
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
      this.update({
        userId,
        object: { acquisitionChannel: ACQUISITION_CHANNELS.REFERRAL_PRO },
      });
      const referralUser = this.get(
        { _id: referralId, roles: { $in: [ROLES.PRO] } },
        { _id: 1 },
      );
      const referralOrg = OrganisationService.get(referralId, { _id: 1 });
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
    const { assignedEmployee: oldAssignee = {} } =
      this.get(userId, { assignedEmployee: { name: 1 } }) || {};

    if (adminId) {
      const newAssignee = this.get(adminId, { name: 1 }) || {};

      this.update({ userId, object: { assignedEmployeeId: adminId } });
      return { oldAssignee, newAssignee };
    }

    this._update({
      id: userId,
      object: { assignedEmployeeId: true },
      operator: '$unset',
    });
    return { oldAssignee, newAssignee: { _id: adminId, name: 'Personne' } };
  };

  setRole = ({ userId, role }) => Roles.setUserRoles(userId, role);

  getUserByPasswordResetToken = ({ token }) =>
    this.get(
      { 'services.password.reset.token': token },
      {
        email: 1,
        emails: 1,
        firstName: 1,
        lastName: 1,
        name: 1,
        phoneNumbers: 1,
      },
    );

  getLoginToken = ({ userId }) => {
    const user = this.get(userId, { services: 1 });

    return (
      user.services.password &&
      user.services.password.reset &&
      user.services.password.reset.token
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
        loans &&
        loans.some(
          ({ promotionLinks }) => promotionLinks && promotionLinks.length > 0,
        )
      );
    }

    return (
      loans &&
      loans.some(({ promotionLinks = [] }) =>
        promotionLinks.some(({ _id }) => _id === promotionId),
      )
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
      loans &&
      loans.some(({ propertyIds = [] }) =>
        propertyIds.some(id => id === propertyId),
      )
    );
  };

  changeEmail = ({ userId, newEmail }) => {
    const { emails } = this.get(userId, { emails: 1 });
    Accounts.addEmail(userId, newEmail);
    Accounts.removeEmail(userId, emails[0].address);
    Accounts.sendVerificationEmail(userId);
    return { oldEmail: emails[0].address, newEmail };
  };

  updateOrganisations = ({ userId, newOrganisations = [] }) => {
    const duplicateOrganisations =
      newOrganisations
        .map(({ _id }) => _id)
        .filter((value, index, self) => self.indexOf(value) === index)
        .length !== newOrganisations.length;

    if (duplicateOrganisations) {
      throw new Meteor.Error(
        'Vous ne pouvez pas lier un compte deux fois à la même organisation.',
      );
    }

    const mainOrgs = newOrganisations.filter(
      ({ metadata }) => metadata?.isMain,
    );
    if (mainOrgs.length !== 1) {
      throw new Meteor.Error(
        'Une des organisations doit être choisie comme "principale"',
      );
    }

    const { organisations: oldOrganisations = [] } = this.get(userId, {
      organisations: { _id: 1 },
    });

    oldOrganisations.forEach(({ _id: organisationId }) =>
      this.removeLink({
        id: userId,
        linkName: 'organisations',
        linkId: organisationId,
      }),
    );

    newOrganisations.forEach(({ _id: organisationId, metadata }) =>
      this.linkOrganisation({ userId, organisationId, metadata }),
    );
  };

  testUserAccount = ({ email, password, role }) => {
    if (this.doesUserExist({ email })) {
      // Sometimes this methods is called twice from a test.....???????
      // Apparently due to a duplicate websocket connection
      return this.getByEmail(email);
    }
    const userId = Accounts.createUser({ email, password });
    Roles.setUserRoles(userId, role);
    return this.get(userId, fullUser());
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
      throw new Meteor.Error(
        "Ce client existe déjà. Vous ne pouvez pas le référer, mais vous pouvez l'inviter sur un de vos biens immobiliers.",
      );
    }

    const { userId, pro, admin } = this.proCreateUser({
      user,
      proUserId,
      sendInvitation: false,
    });

    const loanId = LoanService.fullLoanInsert({ userId });
    LoanService.update({ loanId, object: { shareSolvency } });

    return { userId, admin, pro, isNewUser: true };
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
      pro = this.get(proUserId, {
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
      admin = this.get(assignedEmployeeId, { name: 1 });
      userId = this.adminCreateUser({
        options: {
          email,
          sendEnrollmentEmail: sendInvitation && !pro && Meteor.isProduction,
          firstName,
          lastName,
          phoneNumber,
          referredByUserId: proUserId,
        },
        adminId: admin && admin._id,
      });
    } else {
      const {
        _id: existingUserId,
        assignedEmployeeId: existingAssignedEmployeeId,
      } = this.getByEmail(email, { assignedEmployeeId: 1 });

      admin = this.get(existingAssignedEmployeeId, { name: 1 });
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
    const referOnly =
      propertyIds.length === 0 &&
      promotionIds.length === 0 &&
      properties.length === 0;

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
          userId,
          shareSolvency,
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
            isNewUser,
            pro,
            promotionLotIds: user.promotionLotIds,
            showAllLots: user.showAllLots,
            shareSolvency,
          }),
        ),
      ];
    }
    if (properties && properties.length) {
      const internalPropertyIds = properties.map(property => {
        let propertyId;

        const existingProperty = PropertyService.get(
          { externalId: property.externalId },
          { _id: 1 },
        );

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
          userId,
          shareSolvency,
        }),
      ];
    }

    return Promise.all(promises).then(() => ({
      userId,
      isNewUser,
      proId: proUserId || invitedBy,
      admin,
      pro,
    }));
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
    const { referredByUser: oldReferral } = this.get(userId, {
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

    const newReferral = this.get(proId, {
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
    const { referredByOrganisation: oldReferral = {} } = this.get(userId, {
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
    const newReferral = OrganisationService.get(organisationId, { name: 1 });
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
      const { assignedEmployeeId } = this.get(proId, { assignedEmployeeId: 1 });
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
    const { organisations: userOrganisations = [] } = this.get(userId, {
      organisations: { _id: 1 },
    });
    const isMain =
      typeof metadata.isMain === 'boolean'
        ? metadata.isMain
        : userOrganisations.length === 0;

    const newMetadata = { ...metadata, isMain };

    this.addLink({
      id: userId,
      linkName: 'organisations',
      linkId: organisationId,
      metadata: newMetadata,
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

  getUserMainOrganisation(userId, fragment = { name: 1 }) {
    return OrganisationService.fetchOne({
      $filters: { mainUserLinks: { $elemMatch: { _id: userId } } },
      ...fragment,
    });
  }

  getMainUsersOfOrg({ userId, orgId }) {
    if (!!userId === !!orgId) {
      throw new Meteor.Error(
        'You should provide exactly one of "userId" or "orgId" to "getMainUsersOfOrg"',
      );
    }

    const query = { users: { organisations: { _id: 1 } } };
    const organisations = OrganisationService.fetch({
      $filters: { userLinks: { $elemMatch: { _id: userId } } },
      ...query,
    });

    let mainOrganisation;

    if (orgId) {
      mainOrganisation = OrganisationService.get(orgId, query);
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
    const users = mainOrganisation.users.filter(
      ({ $metadata, organisations: userOrganisations }) => {
        if ($metadata.isMain || userOrganisations.length === 1) {
          return true;
        }
      },
    );

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
      .map(email => {
        const employee = this.getByEmail(email);
        if (employee) {
          return employee._id;
        }
      })
      .filter(x => x);
  }

  setAssigneeForNewUser(userId) {
    const { roles, assignedEmployeeId } = this.get(userId, {
      assignedEmployeeId: 1,
      roles: 1,
    });

    if (assignedEmployeeId) {
      return;
    }
    let newAssignee;

    if (roles.includes(ROLES.USER)) {
      if (!this.employees.length) {
        // In tests or if there are no roundrobin advisors, use any admin
        // in the db and assign it to the user
        // this avoids issues with analytics, that expects all users to have
        // an assignee
        const anyAdmin = this.get(
          { roles: { $in: [ROLES.ADMIN, ROLES.DEV] } },
          { _id: 1 },
        );
        newAssignee = anyAdmin && anyAdmin._id;
      } else {
        const lastCreatedUser = this.get(
          {
            roles: ROLES.USER,
            assignedEmployeeId: { $in: this.employees },
          },
          {
            $options: { sort: { createdAt: -1 } },
            assignedEmployeeId: 1,
            createdAt: 1,
          },
        );

        if (lastCreatedUser?.assignedEmployeeId) {
          const index = this.employees.indexOf(
            lastCreatedUser.assignedEmployeeId,
          );
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
    }

    return this.update({ userId, object: { assignedEmployeeId: newAssignee } });
  }

  getReferral(userId) {
    const { referredByUser, referredByOrganisation } = this.get(userId, {
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

  toggleAccount({ userId }) {
    const { isDisabled } = this.get(userId, { isDisabled: 1 });
    const nextValue = !isDisabled;
    this.update({
      userId,
      object: { isDisabled: nextValue, 'services.resume.loginTokens': [] },
    });
    return nextValue;
  }
}

export default new UserServiceClass({ employees: roundRobinAdvisors });
