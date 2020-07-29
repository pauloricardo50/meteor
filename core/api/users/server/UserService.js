import '../roles/initRoles';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

import omit from 'lodash/omit';
import moment from 'moment';
import NodeRSA from 'node-rsa';

import {
  ACTIVITY_EVENT_METADATA,
  ACTIVITY_TYPES,
} from '../../activities/activityConstants';
import ActivityService from '../../activities/server/ActivityService';
import EVENTS from '../../analytics/events';
import Analytics from '../../analytics/server/Analytics';
import CollectionService from '../../helpers/server/CollectionService';
import { selectorForFastCaseInsensitiveLookup } from '../../helpers/server/mongoServerHelpers';
import IntercomService from '../../intercom/server/IntercomService';
import LoanService from '../../loans/server/LoanService';
import OrganisationService from '../../organisations/server/OrganisationService';
import PromotionService from '../../promotions/server/PromotionService';
import PropertyService from '../../properties/server/PropertyService';
import { getAPIUser } from '../../RESTAPI/server/helpers';
import SecurityService from '../../security';
import TaskService from '../../tasks/server/TaskService';
import { TASK_TYPES } from '../../tasks/taskConstants';
import {
  ACQUISITION_CHANNELS,
  ROLES,
  USER_STATUS,
  USER_STATUS_ORDER,
} from '../userConstants';
import Users from '../users';
import AssigneeService from './AssigneeService';

export class UserServiceClass extends CollectionService {
  constructor() {
    super(Users);
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
        [user] = candidateUsers;
      }
    }

    return user;
  }

  createUser = ({ options, role = ROLES.USER }) => {
    if (!options.password) {
      // password is not even allowed to be undefined,
      // it has to be stripped from the options object
      options = omit(options, ['password']);
    }

    const newUserId = Accounts.createUser(options);

    if (!role) {
      throw new Meteor.Error('New user must have a role');
    }
    Roles.setUserRoles(newUserId, role);

    IntercomService.getIntercomId({ userId: newUserId });

    return newUserId;
  };

  adminCreateUser = ({
    assignedEmployeeId,
    email,
    password,
    referredByOrganisationId,
    referredByUserId,
    role = ROLES.USER,
    sendEnrollmentEmail,
    setAssignee = true,
    ...additionalData
  }) => {
    const newUserId = this.createUser({ options: { email, password }, role });
    this.update({ userId: newUserId, object: additionalData });

    if (referredByUserId) {
      this.setReferredBy({ userId: newUserId, proId: referredByUserId });
    }

    if (referredByOrganisationId) {
      this.setReferredByOrganisation({
        userId: newUserId,
        organisationId: referredByOrganisationId,
      });
    }

    if (setAssignee) {
      new AssigneeService(newUserId).setAssignee(assignedEmployeeId);
    }

    this.setAcquisitionChannel({
      newUserId,
      referredByUserId,
      referredByOrganisationId,
    });

    if (sendEnrollmentEmail) {
      this.sendEnrollmentEmail({ userId: newUserId });
    }

    return newUserId;
  };

  anonymousCreateUser = ({
    user: { phoneNumber, ...user },
    loanId,
    referralId,
  }) => {
    const userId = this.adminCreateUser({
      ...user,
      phoneNumbers: [phoneNumber].filter(x => x),
      sendEnrollmentEmail: true,
      setAssignee: false,
    });
    let loanReferralId;

    if (loanId) {
      loanReferralId = LoanService.assignLoanToUser({ userId, loanId });
    }

    if (referralId && !loanReferralId) {
      const referralUser = this.get(
        { _id: referralId, 'roles._id': ROLES.PRO },
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

    const { referredByUser, referredByOrganisation } = this.get(userId, {
      referredByUser: { _id: 1 },
      referredByOrganisation: { _id: 1 },
    });

    // If the user comes out of this function with a referral, assume it's an organic referral
    if (referredByUser?._id || referredByOrganisation?._id) {
      this.update({
        userId,
        object: { acquisitionChannel: ACQUISITION_CHANNELS.REFERRAL_ORGANIC },
      });
    }

    const newAssigneeId = new AssigneeService(userId).setAssignee();

    if (loanId && newAssigneeId) {
      LoanService.setAssignees({
        loanId,
        assignees: [{ _id: newAssigneeId, percent: 100, isMain: true }],
      });
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

  setRole = ({ userId, role }) => {
    if (role === ROLES.ADMIN) {
      throw new Meteor.Error('Should not set ADMIN role only');
    }

    if (role !== ROLES.ADVISOR) {
      this.baseUpdate(userId, { $unset: { office: true } });
    }

    if (role !== ROLES.USER) {
      this.baseUpdate(userId, { $unset: { status: true } });
    }

    if (role === ROLES.USER) {
      this.baseUpdate(userId, { $set: { status: USER_STATUS.PROSPECT } });
    }

    return Roles.setUserRoles(userId, role);
  };

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

    return user?.services?.password?.reset?.token;
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

    if (newOrganisations.length && mainOrgs.length !== 1) {
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
    return this.get(userId, { _id: 1, name: 1, email: 1, roles: 1 });
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

    const { userId, pro } = this.proCreateUser({
      user,
      proUserId,
    });

    const loanId = LoanService.fullLoanInsert({ userId });
    LoanService.update({ loanId, object: { shareSolvency } });
    const { assignedEmployee } = this.get(userId, {
      assignedEmployee: { name: 1 },
    });

    return { userId, admin: assignedEmployee, pro, isNewUser: true };
  };

  proCreateUser = ({
    user: {
      email,
      firstName,
      lastName,
      phoneNumber,
      status = USER_STATUS.PROSPECT,
    },
    proUserId,
    setAssignee,
  }) => {
    let pro;

    const isNewUser = !this.doesUserExist({ email });
    let userId;

    if (proUserId) {
      pro = this.get(proUserId, { name: 1, organisations: { name: 1 } });
    }

    if (isNewUser) {
      userId = this.adminCreateUser({
        email,
        // Invitation will be sent by the propertyInvitationEmail or
        // promotionInvitationEmail
        sendEnrollmentEmail: false,
        firstName,
        lastName,
        phoneNumbers: [phoneNumber].filter(x => x),
        referredByUserId: proUserId,
        setAssignee,
        status,
      });
    } else {
      const { _id: existingUserId } = this.getByEmail(email, { _id: 1 });
      userId = existingUserId;
    }

    return { userId, pro, isNewUser };
  };

  proInviteUser = ({
    user,
    propertyIds = [],
    promotionIds = [],
    properties = [],
    proUserId,
    shareSolvency,
  }) => {
    const referOnly =
      propertyIds.length === 0 &&
      promotionIds.length === 0 &&
      properties.length === 0;

    if (referOnly) {
      return this.proReferUser({ user, proUserId, shareSolvency });
    }

    if (promotionIds?.length) {
      promotionIds.forEach(promotionId => {
        PromotionService.checkPromotionIsReady({ promotionId });
      });
    }

    let loanIds = [];

    const { invitedBy } = user;
    const { userId, pro, isNewUser } = this.proCreateUser({
      user,
      proUserId: proUserId || invitedBy,
      setAssignee: false, // Wait for loans to be created before setting it manually
    });

    if (propertyIds && propertyIds.length) {
      loanIds = [
        ...loanIds,
        PropertyService.inviteUser({
          propertyIds,
          userId,
          shareSolvency,
        }),
      ];
    }
    if (promotionIds && promotionIds.length) {
      loanIds = [
        ...loanIds,
        ...promotionIds.map(promotionId =>
          PromotionService.inviteUser({
            promotionId,
            userId,
            pro,
            promotionLotIds: user.promotionLotIds,
            showAllLots: user.showAllLots,
            shareSolvency,
            skipCheckPromotionIsReady: true,
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

      loanIds = [
        ...loanIds,
        ...PropertyService.inviteUser({
          propertyIds: internalPropertyIds,
          userId,
          shareSolvency,
        }),
      ];
    }

    if (isNewUser) {
      new AssigneeService(userId).setAssignee();
    }
    const { assignedEmployee: admin } = this.get(userId, {
      assignedEmployee: { name: 1 },
    });

    return {
      userId,
      isNewUser,
      proId: proUserId || invitedBy,
      admin,
      pro,
      loanIds,
    };
  };

  getEnrollmentUrl({ userId }) {
    let domain;

    if (SecurityService.hasRole(userId, ROLES.PRO)) {
      domain = Meteor.settings.public.subdomains.pro;
    } else {
      domain = Meteor.settings.public.subdomains.app;
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
      organisationId = mainOrg?._id;
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
      ...user,
      phoneNumbers: [phoneNumber],
      sendEnrollmentEmail: !Meteor.isDevelopment, // Meteor toys is not defined
      role: ROLES.PRO,
      assignedEmployeeId: assigneeId,
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

  setAcquisitionChannel({
    newUserId,
    referredByUserId,
    referredByOrganisationId,
  }) {
    const APIUser = getAPIUser();

    if (APIUser) {
      this.update({
        userId: newUserId,
        object: { acquisitionChannel: ACQUISITION_CHANNELS.REFERRAL_API },
      });
    } else if (referredByUserId || referredByOrganisationId) {
      const userReferral =
        referredByUserId && this.get(referredByUserId, { roles: 1 });
      const isReferralAdmin =
        userReferral && Roles.userIsInRole(userReferral, ROLES.ADMIN);

      this.update({
        userId: newUserId,
        object: {
          acquisitionChannel: isReferralAdmin
            ? ACQUISITION_CHANNELS.REFERRAL_ADMIN
            : ACQUISITION_CHANNELS.REFERRAL_PRO,
        },
      });
    }
  }

  setStatus({ userId, status, analyticsProperties = {}, serverRun = false }) {
    const user = this.get(userId, {
      status: 1,
      firstName: 1,
      lastName: 1,
      name: 1,
      email: 1,
      assignedEmployee: { name: 1, email: 1 },
      referredByOrganisation: { name: 1 },
      referredByUser: { name: 1 },
    });

    const { status: prevStatus } = user;

    if (status === prevStatus) {
      throw new Meteor.Error(
        'Vous devez choisir un statut différent du précédent',
      );
    }

    if (!serverRun && status === USER_STATUS.PROSPECT) {
      throw new Meteor.Error('Vous ne pouvez pas revenir au status Prospect');
    }

    this._update({ id: userId, object: { status } });

    ActivityService.addServerActivity({
      userLink: { _id: userId },
      title: 'Changement de statut',
      description: `${prevStatus} -> ${status}`,
      type: ACTIVITY_TYPES.EVENT,
      metadata: {
        event: ACTIVITY_EVENT_METADATA.USER_CHANGED_STATUS,
        details: { prevStatus, nextStatus: status },
      },
    });

    const analytics = new Analytics({ userId });
    analytics.track(EVENTS.USER_CHANGED_STATUS, {
      prevStatus,
      nextStatus: status,
      userId: user?._id,
      userName: user?.name,
      userEmail: user?.email,
      referringUserId: user?.referredByUser?._id,
      referringUserName: user?.referredByUser?.name,
      referringOrganisationId: user?.referredByOrganisation?._id,
      referringOrganisationName: user?.referredByOrganisation?.name,
      assigneeId: user?.assignedEmployee?._id,
      assigneeName: user?.assignedEmployee?.name,
      ...analyticsProperties,
    });

    return { prevStatus, nextStatus: status };
  }

  getUsersProspectForTooLong() {
    const twentyOneDaysAgo = moment().subtract(21, 'days').startOf('day');

    const users = this.fetch({
      $filters: {
        createdAt: { $lt: twentyOneDaysAgo.toDate() },
        status: USER_STATUS.PROSPECT,
      },
      name: 1,
      email: 1,
    });

    return users;
  }
}

export default new UserServiceClass();
