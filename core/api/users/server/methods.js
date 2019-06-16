import { Meteor } from 'meteor/meteor';

import Analytics from 'core/api/analytics/server/Analytics';
import EVENTS from 'core/api/analytics/events';
import SecurityService from '../../security';
import {
  doesUserExist,
  sendVerificationLink,
  assignAdminToUser,
  assignAdminToNewUser,
  setRole,
  adminCreateUser,
  updateUser,
  getUserByPasswordResetToken,
  testCreateUser,
  removeUser,
  sendEnrollmentEmail,
  changeEmail,
  userUpdateOrganisations,
  testUserAccount,
  generateApiKeyPair,
  proInviteUser,
  getUserByEmail,
  setUserReferredBy,
  setUserReferredByOrganisation,
  proInviteUserToOrganisation,
  proSetShareCustomers,
  anonymousCreateUser,
} from '../methodDefinitions';
import UserService from './UserService';
import PropertyService from '../../properties/server/PropertyService';
import { ROLES } from '../userConstants';

doesUserExist.setHandler((context, { email }) =>
  UserService.doesUserExist({ email }));

sendVerificationLink.setHandler((context, { userId } = {}) => {
  if (userId) {
    SecurityService.checkCurrentUserIsAdmin();
  } else {
    SecurityService.checkLoggedIn();
  }
  const id = userId || Meteor.userId();

  if (Meteor.isDevelopment) {
    console.log(`Not sending verification link in development for userId: ${id}`);
    return false;
  }

  return UserService.sendVerificationEmail({ userId: id });
});

assignAdminToUser.setHandler((context, { userId, adminId }) => {
  SecurityService.checkCurrentUserIsAdmin();

  return UserService.assignAdminToUser({ userId, adminId });
});

assignAdminToNewUser.setHandler((context, { userId, adminId }) => {
  // same action as assignAdminToUser, but with a dedicated
  // listener that would complete & reassign the user's tasks
  SecurityService.checkCurrentUserIsAdmin();

  return UserService.assignAdminToUser({ userId, adminId });
});

setRole.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return UserService.setRole(params);
});

adminCreateUser.setHandler((context, { options, role }) => {
  SecurityService.users.isAllowedToInsertByRole({ role });
  return UserService.adminCreateUser({
    options,
    role,
    adminId: context.userId,
  });
});

updateUser.setHandler((context, { userId, object }) => {
  SecurityService.users.isAllowedToUpdate(userId, context.userId);

  if (object.roles) {
    SecurityService.handleUnauthorized('Vous ne pouvez pas changer le rôle');
  }

  return UserService.update({ userId, object });
});

getUserByPasswordResetToken.setHandler((context, params) =>
  UserService.getUserByPasswordResetToken(params));

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

changeEmail.setHandler(({ userId }, params) => {
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
      }));
  }

  if (promotionIds && promotionIds.length) {
    promotionIds.forEach(promotionId =>
      SecurityService.promotions.isAllowedToInviteCustomers({
        promotionId,
        userId,
      }));
  }

  if (properties && properties.length) {
    properties.forEach(({ externalId }) => {
      const existingProperty = PropertyService.fetchOne({
        $filters: { externalId },
      });
      if (existingProperty) {
        SecurityService.properties.isAllowedToInviteCustomers({
          userId,
          propertyId: existingProperty._id,
        });
      }
    });
  }

  // Only pass proUserId if this is a pro user
  const isProUser = SecurityService.hasRole(userId, ROLES.PRO);

  return UserService.proInviteUser({
    ...params,
    proUserId: isProUser ? userId : undefined,
    adminId: !isProUser ? userId : undefined,
  });
});

getUserByEmail.setHandler(({ userId }, { email }) => {
  SecurityService.checkUserIsPro(userId);
  const user = UserService.getByEmail(email);

  if (user) {
    return UserService.fetchOne({
      $filters: { $and: [{ _id: user._id }, { roles: { $in: [ROLES.PRO] } }] },
      name: 1,
      organisations: { name: 1 },
    });
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

  const analytics = new Analytics({ ...context, userId });
  analytics.alias(params.trackingId);
  analytics.track(EVENTS.USER_CREATED, { userId, origin: 'anonymous' });
  if (params.loanId) {
    analytics.track(EVENTS.LOAN_ANONYMOUS_LOAN_CLAIMED, {
      loanId: params.loanId,
    });
  }

  return userId;
});
