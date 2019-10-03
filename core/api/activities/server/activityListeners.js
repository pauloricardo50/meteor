import pick from 'lodash/pick';

import { getUserNameAndOrganisation } from 'core/api/helpers/index';
import Intl from 'core/utils/server/intl';
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
  setUserReferredBy,
  changeEmail,
  userVerifyEmail,
  loanSetStatus,
} from '../../methods';
import { ACTIVITY_EVENT_METADATA, ACTIVITY_TYPES } from '../activityConstants';
import UserService from '../../users/server/UserService';
import PromotionService from '../../promotions/server/PromotionService';
import ActivityService from './ActivityService';
import OrganisationService from '../../organisations/server/OrganisationService';
import { getAPIUser } from '../../RESTAPI/server/helpers';

const formatMessage = Intl.formatMessage.bind(Intl);

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
    let mainOrg;

    if (referralId) {
      referredBy = UserService.fetchOne({
        $filters: { _id: referralId },
        name: 1,
        organisations: { name: 1 },
      });
      referredByOrg = OrganisationService.fetchOne({
        $filters: {
          _id: referralId,
        },
        name: 1,
      });
    }

    let description = '';

    if (referredBy) {
      description = `Référé par ${getUserNameAndOrganisation({
        user: referredBy,
      })}`;
      mainOrg = UserService.getUserMainOrganisation(referredBy._id);
    }

    if (referredByOrg) {
      description = `Référé par ${referredByOrg.name}`;
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
          referredByOrg: pick(referredByOrg || mainOrg, ['_id', 'name']),
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
    let referredByAPIOrgLabel = '';
    let referredByAPIOrg;

    if (APIUser) {
      referredByAPIOrg = UserService.getUserMainOrganisation(APIUser._id);
      const proOrg = UserService.getUserMainOrganisation(proId);
      referredByAPIOrgLabel = `${proOrg
        && proOrg.name}, API ${referredByAPIOrg && referredByAPIOrg.name}`;
    }

    if (!referredBy && (referredByOrg || referredByAPIOrgLabel)) {
      description = `Référé par ${referredByAPIOrgLabel || referredByOrg.name}`;
    }

    if (referredBy && !(referredByOrg || referredByAPIOrgLabel)) {
      description = `Référé par ${referredBy.name}`;
    }

    if (referredBy && (referredByOrg || referredByAPIOrgLabel)) {
      description = `Référé par ${referredBy.name} (${referredByAPIOrgLabel
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
        'metadata.event': ACTIVITY_EVENT_METADATA.USER_FIRST_CONNECTION,
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
        metadata: { event: ACTIVITY_EVENT_METADATA.USER_FIRST_CONNECTION },
        userLink: { _id: userId },
        title: 'Première connexion',
        createdBy: userId,
      });
    }
  },
);

ServerEventService.addAfterMethodListener(
  assignAdminToUser,
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
        title: 'Changement de conseiller',
        description: newAssignee.name,
        createdBy: adminId,
      });
    }
  },
);

ServerEventService.addAfterMethodListener(
  [setUserReferredBy, setUserReferredByOrganisation],
  ({ params: { userId }, result = {}, context: { userId: adminId } }) => {
    const { oldReferral = {}, newReferral = {}, referralType } = result;
    if (oldReferral._id !== newReferral._id) {
      const description = referralType === 'org'
        ? newReferral.name
        : getUserNameAndOrganisation({ user: newReferral });
      ActivityService.addServerActivity({
        type: ACTIVITY_TYPES.EVENT,
        metadata: {
          event: ACTIVITY_EVENT_METADATA.USER_CHANGE_REFERRAL,
          details: {
            oldReferral: pick(oldReferral, ['_id', 'name']),
            newReferral: pick(newReferral, ['_id', 'name']),
            referralType,
          },
        },
        userLink: { _id: userId },
        title: 'Changement de referral',
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

ServerEventService.addAfterMethodListener(
  loanSetStatus,
  ({
    context: { userId },
    params: { loanId },
    result: { prevStatus, nextStatus },
  }) => {
    const formattedPrevStatus = formatMessage({
      id: `Forms.status.${prevStatus}`,
    });
    const formattedNexStatus = formatMessage({
      id: `Forms.status.${nextStatus}`,
    });
    const { name: adminName } = UserService.fetchOne({
      $filters: { _id: userId },
      name: 1,
    });

    ActivityService.addServerActivity({
      type: ACTIVITY_TYPES.EVENT,
      loanLink: { _id: loanId },
      title: 'Statut modifié',
      description: `${formattedPrevStatus} -> ${formattedNexStatus}, par ${adminName}`,
      createdBy: userId,
      metadata: {
        event: ACTIVITY_EVENT_METADATA.LOAN_CHANGE_STATUS,
        details: { prevStatus, nextStatus },
      },
    });
  },
);
