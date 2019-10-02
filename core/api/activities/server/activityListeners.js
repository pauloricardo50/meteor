import pick from 'lodash/pick';

import { getUserNameAndOrganisation } from 'core/api/helpers/index';
import ServerEventService from '../../events/server/ServerEventService';
import {
  removeLoanFromPromotion,
  toggleAccount,
  anonymousCreateUser,
  userPasswordReset,
  setUserReferredByOrganisation,
  proInviteUser,
  adminCreateUser,
  assignAdminToUser,
  assignAdminToNewUser,
  setUserReferredBy,
  changeEmail,
  userVerifyEmail,
} from '../../methods';
import { ACTIVITY_EVENT_METADATA, ACTIVITY_TYPES } from '../activityConstants';
import UserService from '../../users/server/UserService';
import PromotionService from '../../promotions/server/PromotionService';
import ActivityService from './ActivityService';
import OrganisationService from '../../organisations/server/OrganisationService';
import { getAPIUser } from '../../RESTAPI/server/helpers';

ServerEventService.addAfterMethodListener(
  removeLoanFromPromotion,
  ({ params: { loanId, promotionId }, context: { userId } }) => {
    const { name } = PromotionService.fetchOne({
      $filters: { _id: promotionId },
      name: 1,
    });
    const { name: userName } = UserService.fetchOne({
      $filters: { _id: userId },
      name: 1,
    }) || {};

    ActivityService.addServerActivity({
      metadata: {
        event: ACTIVITY_EVENT_METADATA.REMOVE_LOAN_FROM_PROMOTION,
      },
      type: ACTIVITY_TYPES.EVENT,
      loanLink: { _id: loanId },
      title: `Enlevé de la promotion "${name}"`,
      description: userName ? `Par ${userName}` : '',
      createdBy: userId,
    });
  },
);

ServerEventService.addAfterMethodListener(
  toggleAccount,
  ({
    params: { userId },
    context: { userId: adminId },
    result: isDisabled,
  }) => {
    const { name: adminName } = UserService.fetchOne({ $filters: { _id: adminId }, name: 1 }) || {};
    ActivityService.addServerActivity({
      metadata: {
        event: ACTIVITY_EVENT_METADATA.ACCOUNT_DISABLED,
      },
      userLink: { _id: userId },
      title: `Compte ${isDisabled ? 'désactivé' : 'activé'}`,
      description: adminName ? `Par ${adminName}` : '',
      createdBy: adminId,
      type: ACTIVITY_TYPES.EVENT,
    });
  },
);

ServerEventService.addAfterMethodListener(
  anonymousCreateUser,
  ({ result: userId, params: { referralId } }) => {
    const currentUser = UserService.get(userId);
    const { createdAt } = currentUser;

    let referredBy;
    let referredByOrg;

    if (referralId) {
      referredBy = UserService.fetchOne({
        $filters: { _id: referralId },
        name: 1,
      });
      referredByOrg = OrganisationService.fetchOne({
        $filters: {
          _id: referralId,
        },
        name: 1,
      });
    }

    let description = '';

    if (!referredBy && referredByOrg) {
      description = `Référé par ${referredByOrg.name}`;
    }

    if (referredBy && !referredByOrg) {
      description = `Référé par ${referredBy.name}`;
    }

    if (referredBy && referredByOrg) {
      description = `Référé par ${referredBy.name} (${referredByOrg.name})`;
    }

    ActivityService.addCreatedAtActivity({
      createdAt,
      userLink: { _id: userId },
      title: 'Compte créé',
      description,
      createdBy: userId,
      metadata: {
        details: {
          referredBy: pick(referredBy, ['_id', 'name']),
          referredByOrg: pick(referredByOrg, ['_id', 'name']),
        },
      },
    });
  },
);

ServerEventService.addAfterMethodListener(
  proInviteUser,
  ({
    params: {
      user: { email },
    },
    context: { userId: proId },
  }) => {
    const APIUser = getAPIUser();

    const currentUser = UserService.fetchOne({
      $filters: { 'emails.address': { $in: [email] } },
      activities: { metadata: 1 },
      referredByUserLink: 1,
      referredByOrganisationLink: 1,
      createdAt: 1,
    });

    const { activities = [] } = currentUser;

    // User already exists
    if (
      activities.length
      && activities.find(({ metadata }) =>
        metadata && metadata.event === ACTIVITY_EVENT_METADATA.CREATED)
    ) {
      return;
    }

    const {
      referredByUserLink,
      referredByOrganisationLink,
      createdAt,
      _id: userId,
    } = currentUser;

    let description = '';
    const referredBy = UserService.get(referredByUserLink);
    const referredByOrg = OrganisationService.get(referredByOrganisationLink);
    let referredByAPIOrg = '';

    if (APIUser) {
      const mainOrg = UserService.getUserMainOrganisation(APIUser._id);
      const proOrg = UserService.getUserMainOrganisation(proId);
      referredByAPIOrg = `${proOrg && proOrg.name}, API ${mainOrg
        && mainOrg.name}`;
    }

    if (!referredBy && (referredByOrg || referredByAPIOrg)) {
      description = `Référé par ${referredByAPIOrg || referredByOrg.name}`;
    }

    if (referredBy && !(referredByOrg || referredByAPIOrg)) {
      description = `Référé par ${referredBy.name}`;
    }

    if (referredBy && (referredByOrg || referredByAPIOrg)) {
      description = `Référé par ${referredBy.name} (${referredByAPIOrg
        || referredByOrg.name})`;
    }

    ActivityService.addCreatedAtActivity({
      createdAt,
      userLink: { _id: userId },
      title: 'Compte créé',
      description,
      createdBy: proId,
      metadata: {
        details: {
          referredBy: pick(referredBy, ['_id', 'name']),
          referredByOrg: pick(referredByOrg, ['_id', 'name']),
          referredByAPIOrg: pick(referredByAPIOrg, ['_id', 'name']),
        },
      },
    });
  },
);

ServerEventService.addAfterMethodListener(
  adminCreateUser,
  ({ result: userId, context: { userId: adminId } }) => {
    const currentUser = UserService.get(userId);
    const { createdAt } = currentUser;
    const admin = UserService.fetchOne({ $filters: { _id: adminId }, name: 1 }) || {};
    const { name: adminName } = admin;

    ActivityService.addCreatedAtActivity({
      createdAt,
      userLink: { _id: userId },
      title: 'Compte créé',
      description: adminName && `Par ${adminName}`,
      createdBy: adminId,
      metadata: { details: { admin: pick(admin, ['_id', 'name']) } },
    });
  },
);

ServerEventService.addAfterMethodListener(
  userPasswordReset,
  ({ context: { userId } }) => {
    const firstConnectionActivity = ActivityService.fetchOne({
      $filters: {
        'userLink._id': userId,
        'metadata.event': ACTIVITY_EVENT_METADATA.USER_FIRST_CONNECTIOM,
      },
    });
    ActivityService.addServerActivity({
      type: ACTIVITY_TYPES.EVENT,
      metadata: { event: ACTIVITY_EVENT_METADATA.USER_PASSWORD_SET },
      userLink: { _id: userId },
      title: 'Mot de passe choisi',
      createdBy: userId,
    });

    if (!firstConnectionActivity) {
      ActivityService.addServerActivity({
        type: ACTIVITY_TYPES.EVENT,
        metadata: { event: ACTIVITY_EVENT_METADATA.USER_FIRST_CONNECTIOM },
        userLink: { _id: userId },
        title: 'Première connexion',
        createdBy: userId,
      });
    }
  },
);

ServerEventService.addAfterMethodListener(
  [assignAdminToUser, assignAdminToNewUser],
  ({ params: { userId }, result = {}, context: { userId: adminId } }) => {
    const { oldAssignee, newAssignee } = result;
    if (oldAssignee._id !== newAssignee._id) {
      ActivityService.addServerActivity({
        type: ACTIVITY_TYPES.EVENT,
        metadata: {
          event: ACTIVITY_EVENT_METADATA.USER_CHANGE_ASSIGNEE,
          details: {
            oldAssignee: pick(oldAssignee, ['_id', 'name']),
            newAssignee: pick(newAssignee, ['_id', 'name']),
          },
        },
        userLink: { _id: userId },
        title: 'Changemenet de conseiller',
        description: newAssignee.name,
        createdBy: adminId,
      });
    }
  },
);

ServerEventService.addAfterMethodListener(
  [setUserReferredBy, setUserReferredByOrganisation],
  ({ params: { userId }, result = {}, context: { userId: adminId } }) => {
    const { oldReferral, newReferral, referralType } = result;
    if (oldReferral._id !== newReferral._id) {
      const description = referralType === 'org'
        ? newReferral.name
        : getUserNameAndOrganisation({ user: newReferral });
      ActivityService.addServerActivity({
        type: ACTIVITY_TYPES.EVENT,
        metadata: {
          event: ACTIVITY_EVENT_METADATA.USER_CHANGE_REFERRAL,
          details: { oldReferral, newReferral, referralType },
        },
        userLink: { _id: userId },
        title: 'Changemenet de referral',
        description,
        createdBy: adminId,
      });
    }
  },
);

ServerEventService.addAfterMethodListener(
  changeEmail,
  ({
    params: { userId },
    result: { oldEmail, newEmail },
    context: { userId: adminId },
  }) => {
    ActivityService.addServerActivity({
      type: ACTIVITY_TYPES.EVENT,
      metadata: {
        event: ACTIVITY_EVENT_METADATA.USER_CHANGE_EMAIL,
        details: { oldEmail, newEmail },
      },
      userLink: { _id: userId },
      title: "Changemenet d'email",
      description: newEmail,
      createdBy: adminId,
    });
  },
);

ServerEventService.addAfterMethodListener(
  userVerifyEmail,
  ({ context: { userId } }) => {
    ActivityService.addServerActivity({
      type: ACTIVITY_TYPES.EVENT,
      metadata: { event: ACTIVITY_EVENT_METADATA.USER_VERIFIED_EMAIL },
      userLink: { _id: userId },
      title: 'Adresse email vérifiée',
      createdBy: userId,
    });
  },
);
