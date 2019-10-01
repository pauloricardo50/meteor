import { proInviteUser, adminCreateUser } from 'core/api/users/index';
import ServerEventService from '../../events/server/ServerEventService';
import {
  removeLoanFromPromotion,
  toggleAccount,
  anonymousCreateUser,
} from '../../methods';
import { ACTIVITY_SECONDARY_TYPES } from '../activityConstants';
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
      secondaryType: ACTIVITY_SECONDARY_TYPES.REMOVE_LOAN_FROM_PROMOTION,
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
      secondaryType: ACTIVITY_SECONDARY_TYPES.ACCOUNT_DISABLED,
      userLink: { _id: userId },
      title: `Compte ${isDisabled ? 'désactivé' : 'activé'}`,
      description: adminName ? `Par ${adminName}` : '',
      createdBy: adminId,
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
      activities: { secondaryType: 1 },
      referredByUserLink: 1,
      referredByOrganisationLink: 1,
      createdAt: 1,
    });

    const { activities = [] } = currentUser;

    // User already exists
    if (
      activities.length
      && activities.find(({ secondaryType }) =>
        secondaryType === ACTIVITY_SECONDARY_TYPES.CREATED)
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
      createdBy: userId,
    });
  },
);

ServerEventService.addAfterMethodListener(
  adminCreateUser,
  ({ result: userId, context: { userId: adminId } }) => {
    const currentUser = UserService.get(userId);
    const { createdAt } = currentUser;
    const { name: adminName } = UserService.fetchOne({ $filters: { _id: adminId }, name: 1 }) || {};

    ActivityService.addCreatedAtActivity({
      createdAt,
      userLink: { _id: userId },
      title: 'Compte créé',
      description: adminName && `Par ${adminName}`,
      createdBy: userId,
    });
  },
);
