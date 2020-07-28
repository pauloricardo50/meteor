import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import PropertyService from '../../properties/server/PropertyService';
import { HTTP_STATUS_CODES } from '../../RESTAPI/server/restApiConstants';
import SecurityService from '../../security';
import {
  adminCreateUser,
  anonymousCreateUser,
  assignAdminToUser,
  changeEmail,
  doesUserExist,
  generateApiKeyPair,
  getEnrollUrl,
  getProByEmail,
  getUserByPasswordResetToken,
  proInviteUser,
  proInviteUserToOrganisation,
  proSetShareCustomers,
  removeUser,
  sendEnrollmentEmail,
  sendVerificationLink,
  setRole,
  setUserReferredBy,
  setUserReferredByOrganisation,
  setUserStatus,
  testCreateUser,
  testUserAccount,
  toggleAccount,
  updateUser,
  userPasswordReset,
  userUpdateOrganisations,
  userVerifyEmail,
} from '../methodDefinitions';
import { ROLES } from '../userConstants';
import AssigneeService from './AssigneeService';
import UserService from './UserService';

doesUserExist.setHandler((context, { email }) =>
  UserService.doesUserExist({ email }),
);

sendVerificationLink.setHandler((context, { userId } = {}) => {
  if (userId) {
    SecurityService.checkCurrentUserIsAdmin();
  } else {
    SecurityService.checkLoggedIn();
  }
  const id = userId || Meteor.userId();

  if (Meteor.isDevelopment) {
    console.log(
      `Not sending verification link in development for userId: ${id}`,
    );
    return false;
  }

  return UserService.sendVerificationEmail({ userId: id });
});

assignAdminToUser.setHandler((context, { userId, adminId }) => {
  SecurityService.checkCurrentUserIsAdmin();

  return AssigneeService.assignAdminToUser({ userId, adminId });
});

setRole.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return UserService.setRole(params);
});

adminCreateUser.setHandler((context, { user }) => {
  SecurityService.users.isAllowedToInsertByRole({ role: user.role });
  return UserService.adminCreateUser(user);
});

updateUser.setHandler((context, { userId, object }) => {
  SecurityService.users.isAllowedToUpdate(userId, context.userId);

  if (object.roles) {
    SecurityService.handleUnauthorized('Vous ne pouvez pas changer le rôle');
  }

  return UserService.update({ userId, object });
});

getUserByPasswordResetToken.setHandler((context, params) =>
  UserService.getUserByPasswordResetToken(params),
);

testCreateUser.setHandler((context, params) => {
  if (!Meteor.isTest) {
    throw new Meteor.Error('Test only');
  }
  return UserService.testCreateUser(params);
});

removeUser.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsDev();
  UserService.remove(params);
});

sendEnrollmentEmail.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return UserService.sendEnrollmentEmail(params);
});

changeEmail.setHandler((context, params) => {
  const { userId } = context;
  context.unblock(); // This method will send an email to the user
  SecurityService.users.isAllowedToUpdate(userId, params.userId);
  return UserService.changeEmail(params);
});

userUpdateOrganisations.setHandler((context, { userId, newOrganisations }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return UserService.updateOrganisations({ userId, newOrganisations });
});

testUserAccount.setHandler((context, params) => {
  if (Meteor.isTest) {
    return UserService.testUserAccount(params);
  }
});

generateApiKeyPair.setHandler((context, params) => {
  SecurityService.checkUserIsPro(context.userId);
  return UserService.generateKeyPair(params);
});

proInviteUser.setHandler((context, params) => {
  const { userId } = context;
  const { propertyIds, promotionIds, properties } = params;
  SecurityService.checkUserIsPro(userId);

  if (propertyIds && propertyIds.length) {
    propertyIds.forEach(propertyId =>
      SecurityService.properties.isAllowedToInviteCustomers({
        userId,
        propertyId,
      }),
    );
  }

  if (promotionIds && promotionIds.length > 1) {
    throw new Meteor.Error(
      HTTP_STATUS_CODES.BAD_REQUEST,
      "Vous ne pouvez inviter un client qu'à une seule promotion à la fois",
    );
  }

  if (promotionIds && promotionIds.length) {
    promotionIds.forEach(promotionId =>
      SecurityService.promotions.isAllowedToInviteCustomers({
        promotionId,
        userId,
      }),
    );
  }

  if (properties && properties.length) {
    properties.forEach(({ externalId }) => {
      const existingProperty = PropertyService.get({ externalId }, { _id: 1 });
      if (existingProperty) {
        SecurityService.properties.isAllowedToInviteCustomers({
          userId,
          propertyId: existingProperty._id,
        });
      }
    });
  }

  // Only pass proUserId if this is a pro user
  const isProUser = SecurityService.hasAssignedRole(userId, ROLES.PRO);

  return UserService.proInviteUser({
    ...params,
    proUserId: isProUser ? userId : undefined,
  });
});

getProByEmail.setHandler(({ userId }, { email }) => {
  SecurityService.checkUserIsPro(userId);
  const user = UserService.getByEmail(email);

  if (user) {
    return UserService.get(
      { _id: user._id, 'roles._id': ROLES.PRO },
      {
        name: 1,
        organisations: { name: 1 },
      },
    );
  }
});

setUserReferredBy.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return UserService.setReferredBy(params);
});

setUserReferredByOrganisation.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return UserService.setReferredByOrganisation(params);
});

proInviteUserToOrganisation.setHandler(({ userId }, params) => {
  const { organisationId } = params;
  SecurityService.checkUserIsPro(userId);
  SecurityService.users.isAllowedToInviteUsersToOrganisation({
    userId,
    organisationId,
  });

  if (SecurityService.currentUserIsAdmin()) {
    params.adminId = userId;
  } else {
    params.proId = userId;
  }

  return UserService.proInviteUserToOrganisation(params);
});

proSetShareCustomers.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsPro(userId);
  return UserService.proSetShareCustomers(params);
});

anonymousCreateUser.setHandler((context, params) => {
  if (params.loanId) {
    SecurityService.loans.checkAnonymousLoan(params.loanId);
  }

  const userId = UserService.anonymousCreateUser(params);
  return userId;
});
anonymousCreateUser.setRateLimit({ limit: 1, timeRange: 30000 }); // Once every 30sec

// Method to toggle provided user account only if the current user is admin
toggleAccount.setHandler((context, { userId }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return UserService.toggleAccount({ userId });
});

userPasswordReset.setHandler(() => null);
userVerifyEmail.setHandler(() => null);

getEnrollUrl.setHandler((context, { userId }) => {
  if (Meteor.isDevelopment) {
    const token = UserService.getLoginToken({ userId });
    const userIsPro = Roles.userIsInRole(userId, ROLES.PRO);
    if (userIsPro) {
      return `${Meteor.settings.public.subdomains.pro}/enroll-account/${token}`;
    }
    return `${Meteor.settings.public.subdomains.app}/enroll-account/${token}`;
  }
});

setUserStatus.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return UserService.setStatus({
    ...params,
    analyticsProperties: { statusChangeReason: 'Manual change' },
  });
});
