import pick from 'lodash/pick';

import { getUserNameAndOrganisation } from 'core/api/helpers/index';
import Intl from 'core/utils/server/intl';
import { EMAIL_IDS } from 'core/api/email/emailConstants';
import { fullUser } from 'core/api/fragments';
import { loanSetDisbursementDate } from 'core/api/loans/index';
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
  sendLoanChecklist,
} from '../../methods';
import { ACTIVITY_EVENT_METADATA, ACTIVITY_TYPES } from '../activityConstants';
import UserService from '../../users/server/UserService';
import PromotionService from '../../promotions/server/PromotionService';
import ActivityService from './ActivityService';
import OrganisationService from '../../organisations/server/OrganisationService';
import { getAPIUser } from '../../RESTAPI/server/helpers';
import LoanService from '../../loans/server/LoanService';

const formatMessage = Intl.formatMessage.bind(Intl);

ServerEventService.addAfterMethodListener(
  removeLoanFromPromotion,
  ({ params: { loanId, promotionId }, context }) => {
    context.unblock();
    const { userId } = context;

    const { name } = PromotionService.get(promotionId, { name: 1 });
    const { name: userName } = UserService.get(userId, { name: 1 }) || {};

    ActivityService.addEventActivity({
      event: ACTIVITY_EVENT_METADATA.REMOVE_LOAN_FROM_PROMOTION,
      isServerGenerated: true,
      loanLink: { _id: loanId },
      title: `Enlevé de la promotion "${name}"`,
      description: userName ? `Par ${userName}` : '',
      createdBy: userId,
    });
  },
);

ServerEventService.addAfterMethodListener(
  toggleAccount,
  ({ params: { userId }, context, result: isDisabled }) => {
    context.unblock();
    const { userId: adminId } = context;
    const { name: adminName } = UserService.get(adminId, { name: 1 }) || {};

    ActivityService.addEventActivity({
      event: ACTIVITY_EVENT_METADATA.ACCOUNT_DISABLED,
      isServerGenerated: true,
      userLink: { _id: userId },
      title: `Compte ${isDisabled ? 'désactivé' : 'activé'}`,
      description: adminName ? `Par ${adminName}` : '',
      createdBy: adminId,
    });
  },
);

ServerEventService.addAfterMethodListener(
  anonymousCreateUser,
  ({ result: userId, params: { referralId }, context }) => {
    context.unblock();

    const currentUser = UserService.get(userId, fullUser());
    const { createdAt } = currentUser;

    let referredBy;
    let referredByOrg;
    let mainOrg;

    if (referralId) {
      referredBy = UserService.get(referralId, {
        name: 1,
        organisations: { name: 1 },
      });
      referredByOrg = OrganisationService.get(referralId, { name: 1 });
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
    context,
  }) => {
    context.unblock();
    const { userId: proId } = context;
    const APIUser = getAPIUser();

    const currentUser = UserService.get(
      { 'emails.address': { $in: [email] } },
      {
        activities: { metadata: 1 },
        referredByUserLink: 1,
        referredByOrganisationLink: 1,
        createdAt: 1,
      },
    );

    const { activities = [] } = currentUser;

    // User already exists
    if (
      activities.length &&
      activities.find(
        ({ metadata }) =>
          metadata && metadata.event === ACTIVITY_EVENT_METADATA.CREATED,
      )
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
    const referredBy = UserService.get(referredByUserLink, fullUser());
    const referredByOrg = OrganisationService.get(referredByOrganisationLink, {
      name: 1,
    });
    let referredByAPIOrgLabel = '';
    let referredByAPIOrg;

    if (APIUser) {
      referredByAPIOrg = UserService.getUserMainOrganisation(APIUser._id);
      const proOrg = UserService.getUserMainOrganisation(proId);
      referredByAPIOrgLabel = `${proOrg &&
        proOrg.name}, API ${referredByAPIOrg && referredByAPIOrg.name}`;
    }

    if (!referredBy && (referredByOrg || referredByAPIOrgLabel)) {
      description = `Référé par ${referredByAPIOrgLabel || referredByOrg.name}`;
    }

    if (referredBy && !(referredByOrg || referredByAPIOrgLabel)) {
      description = `Référé par ${referredBy.name}`;
    }

    if (referredBy && (referredByOrg || referredByAPIOrgLabel)) {
      description = `Référé par ${referredBy.name} (${referredByAPIOrgLabel ||
        referredByOrg.name})`;
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
  ({ result: userId, context }) => {
    context.unblock();
    const { userId: adminId } = context;
    const currentUser = UserService.get(userId, fullUser());
    const { createdAt } = currentUser;
    const admin = UserService.get(adminId, { name: 1 }) || {};
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

ServerEventService.addAfterMethodListener(userPasswordReset, ({ context }) => {
  context.unblock();
  const { userId } = context;
  const firstConnectionActivity = ActivityService.get(
    {
      'userLink._id': userId,
      'metadata.event': ACTIVITY_EVENT_METADATA.USER_FIRST_CONNECTION,
    },
    { _id: 1 },
  );

  ActivityService.addEventActivity({
    event: ACTIVITY_EVENT_METADATA.USER_PASSWORD_SET,
    isServerGenerated: true,
    userLink: { _id: userId },
    title: 'Mot de passe choisi',
    createdBy: userId,
  });

  if (!firstConnectionActivity) {
    ActivityService.addEventActivity({
      event: ACTIVITY_EVENT_METADATA.USER_FIRST_CONNECTION,
      isServerGenerated: true,
      userLink: { _id: userId },
      title: 'Première connexion',
      createdBy: userId,
    });
  }
});

ServerEventService.addAfterMethodListener(
  assignAdminToUser,
  ({ params: { userId }, result = {}, context }) => {
    context.unblock();
    const { userId: adminId } = context;
    const { oldAssignee, newAssignee } = result;
    if (oldAssignee._id !== newAssignee._id) {
      ActivityService.addEventActivity({
        event: ACTIVITY_EVENT_METADATA.USER_CHANGE_ASSIGNEE,
        details: {
          oldAssignee: pick(oldAssignee, ['_id', 'name']),
          newAssignee: pick(newAssignee, ['_id', 'name']),
        },
        isServerGenerated: true,
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
  ({ params: { userId }, result = {}, context }) => {
    context.unblock();
    const { userId: adminId } = context;
    const { oldReferral = {}, newReferral = {}, referralType } = result;
    if (oldReferral._id !== newReferral._id) {
      const description =
        referralType === 'org'
          ? newReferral.name
          : getUserNameAndOrganisation({ user: newReferral });

      ActivityService.addEventActivity({
        event: ACTIVITY_EVENT_METADATA.USER_CHANGE_REFERRAL,
        details: {
          oldReferral: pick(oldReferral, ['_id', 'name']),
          newReferral: pick(newReferral, ['_id', 'name']),
          referralType,
        },
        isServerGenerated: true,
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
  ({ params: { userId }, result: { oldEmail, newEmail }, context }) => {
    context.unblock();
    const { userId: adminId } = context;
    ActivityService.addEventActivity({
      event: ACTIVITY_EVENT_METADATA.USER_CHANGE_EMAIL,
      details: { oldEmail, newEmail },
      isServerGenerated: true,
      userLink: { _id: userId },
      title: "Changement d'email",
      description: newEmail,
      createdBy: adminId,
    });
  },
);

ServerEventService.addAfterMethodListener(userVerifyEmail, ({ context }) => {
  context.unblock();
  const { userId } = context;
  ActivityService.addEventActivity({
    event: ACTIVITY_EVENT_METADATA.USER_VERIFIED_EMAIL,
    isServerGenerated: true,
    userLink: { _id: userId },
    title: 'Adresse email vérifiée',
    createdBy: userId,
  });
});

ServerEventService.addAfterMethodListener(
  loanSetStatus,
  ({ context, params: { loanId }, result: { prevStatus, nextStatus } }) => {
    context.unblock();
    const { userId } = context;
    const formattedPrevStatus = formatMessage({
      id: `Forms.status.${prevStatus}`,
    });
    const formattedNexStatus = formatMessage({
      id: `Forms.status.${nextStatus}`,
    });
    const { name: adminName } = UserService.get(userId, { name: 1 });

    ActivityService.addEventActivity({
      event: ACTIVITY_EVENT_METADATA.LOAN_CHANGE_STATUS,
      details: { prevStatus, nextStatus },
      isServerGenerated: true,
      loanLink: { _id: loanId },
      title: 'Statut modifié',
      description: `${formattedPrevStatus} -> ${formattedNexStatus}, par ${adminName}`,
      createdBy: userId,
    });
  },
);

ServerEventService.addAfterMethodListener(
  sendLoanChecklist,
  ({
    params: {
      address,
      loanId,
      emailParams: { assigneeAddress },
    },
    context,
  }) => {
    context.unblock();
    const { userId } = context;
    const { email } = UserService.get(userId, { email: 1 });
    ActivityService.addEmailActivity({
      emailId: EMAIL_IDS.LOAN_CHECKLIST,
      to: address,
      from: assigneeAddress,
      isServerGenerated: true,
      loanLink: { _id: loanId },
      title: 'Checklist envoyée',
      description: `Par ${email}`,
      createdBy: userId,
    });
  },
);

ServerEventService.addAfterMethodListener(
  loanSetDisbursementDate,
  ({ params: { loanId, disbursementDate } }) => {
    const { activities = [] } = LoanService.get(loanId, {
      activities: { type: 1, metadata: 1 },
    });
    const disbursementDateActivity = activities.find(
      ({ type, metadata }) =>
        type === ACTIVITY_TYPES.EVENT &&
        metadata.event === ACTIVITY_EVENT_METADATA.LOAN_DISBURSEMENT_DATE,
    );

    if (disbursementDateActivity) {
      const { _id: activityId } = disbursementDateActivity;
      ActivityService.rawCollection.update(
        { _id: activityId },
        { $set: { date: disbursementDate } },
      );
    } else {
      ActivityService.addEventActivity({
        event: ACTIVITY_EVENT_METADATA.LOAN_DISBURSEMENT_DATE,
        isServerGenerated: true,
        loanLink: { _id: loanId },
        title: 'Décaissement des fonds',
        date: disbursementDate,
        isImportant: true,
      });
    }
  },
);
