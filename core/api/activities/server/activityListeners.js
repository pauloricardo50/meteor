import pick from 'lodash/pick';

import Intl from '../../../utils/server/intl';
import { EMAIL_IDS } from '../../email/emailConstants';
import ServerEventService from '../../events/server/ServerEventService';
import { getUserNameAndOrganisation } from '../../helpers';
import {
  insuranceRequestSetAssignees,
  insuranceRequestUpdateStatus,
} from '../../insuranceRequests/methodDefinitions';
import {
  loanSetAssignees,
  loanSetDisbursementDate,
  loanSetStatus,
  sendLoanChecklist,
} from '../../loans/methodDefinitions';
import LoanService from '../../loans/server/LoanService';
import OrganisationService from '../../organisations/server/OrganisationService';
import { removeLoanFromPromotion } from '../../promotions/methodDefinitions';
import PromotionService from '../../promotions/server/PromotionService';
import { getAPIUser } from '../../RESTAPI/server/helpers';
import {
  adminCreateUser,
  anonymousCreateUser,
  assignAdminToUser,
  changeEmail,
  proInviteUser,
  setUserReferredBy,
  setUserReferredByOrganisation,
  toggleAccount,
  userPasswordReset,
  userVerifyEmail,
} from '../../users/methodDefinitions';
import UserService from '../../users/server/UserService';
import { ACTIVITY_EVENT_METADATA, ACTIVITY_TYPES } from '../activityConstants';
import ActivityService from './ActivityService';

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

    const { createdAt } = UserService.get(userId, { createdAt: 1 });

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

    const currentUser = UserService.getByEmail(email, {
      activities: { metadata: 1 },
      referredByUserLink: 1,
      referredByOrganisationLink: 1,
      createdAt: 1,
    });

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
    const referredBy = UserService.get(referredByUserLink, { name: 1 });
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
    const { createdAt } = UserService.get(userId, { createdAt: 1 });
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

ServerEventService.addAfterMethodListener(
  [loanSetAssignees, insuranceRequestSetAssignees],
  ({ context, params: { loanId, insuranceRequestId, assignees, note } }) => {
    context.unblock();
    const { userId } = context;

    let eventParams;

    if (loanId) {
      eventParams = {
        event: ACTIVITY_EVENT_METADATA.NEW_LOAN_ASSIGNEES,
        loanLink: { _id: loanId },
      };
    } else if (insuranceRequestId) {
      eventParams = {
        event: ACTIVITY_EVENT_METADATA.NEW_INSURANCE_REQUEST_ASSIGNEES,
        insuranceRequestLink: { _id: insuranceRequestId },
      };
    }

    ActivityService.addEventActivity({
      ...eventParams,
      isServerGenerated: true,
      title: `Nouvelle répartition des conseillers`,
      description: `Répartition: ${assignees
        .map(({ _id, percent }) => {
          const assignee = UserService.get(_id, { firstName: 1 });
          return assignee && `${assignee.firstName} (${percent}%)`;
        })
        .join(', ')}\nNote: "${note}"`,
      createdBy: userId,
    });
  },
);

ServerEventService.addAfterMethodListener(
  insuranceRequestUpdateStatus,
  ({
    context,
    params: { insuranceRequestId },
    result: { prevStatus, nextStatus },
  }) => {
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
      event: ACTIVITY_EVENT_METADATA.INSURANCE_REQUEST_CHANGE_STATUS,
      details: { prevStatus, nextStatus },
      isServerGenerated: true,
      insuranceRequestLink: { _id: insuranceRequestId },
      title: 'Statut modifié',
      description: `${formattedPrevStatus} -> ${formattedNexStatus}, par ${adminName}`,
      createdBy: userId,
    });
  },
);
