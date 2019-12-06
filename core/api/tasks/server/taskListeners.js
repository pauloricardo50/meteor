import moment from 'moment';

import PropertyService from 'core/api/properties/server/PropertyService';
import PromotionService from 'core/api/promotions/server/PromotionService';
import {
  generateExpiringSoonReservationTasks,
  generateTenDayExpirationReminderTasks,
} from 'core/api/promotionOptions/server/methods';
import { getUserNameAndOrganisation } from '../../helpers';
import UserService from '../../users/server/UserService';
import ServerEventService from '../../events/server/ServerEventService';
import {
  adminCreateUser,
  anonymousCreateUser,
  proInviteUser,
  loanShareSolvency,
  setMaxPropertyValueWithoutBorrowRatio,
} from '../../methods';
import {
  LOANS_COLLECTION,
  USERS_COLLECTION,
  PROMOTIONS_COLLECTION,
} from '../../constants';
import TaskService from './TaskService';
import LoanService from '../../loans/server/LoanService';

const newUserTask = ({ userId, ...params }) =>
  TaskService.insert({
    object: {
      title: 'Nouveau client, prendre contact',
      docId: userId,
      collection: USERS_COLLECTION,
      ...params,
    },
  });

ServerEventService.addAfterMethodListener(
  [adminCreateUser, anonymousCreateUser],
  ({ context, result: userId }) => {
    context.unblock();

    if (userId) {
      newUserTask({ userId });
    }
  },
);

ServerEventService.addAfterMethodListener(
  proInviteUser,
  ({
    result: { userId },
    context,
    params: { invitationNote, properties, propertyIds, promotionIds },
  }) => {
    const { userId: proId } = context;
    context.unblock();

    const user = UserService.get(userId, {
      assignedEmployeeId: 1,
      createdAt: 1,
    });
    const pro = UserService.get(proId, { name: 1, organisations: { name: 1 } });

    let isNewUser = true;
    const now = new Date();

    // If a user has been created more than 10 seconds ago, assume it already existed
    if (now.valueOf() - user.createdAt.valueOf() > 10000) {
      isNewUser = false;
    }

    let taskDescription = `Invitation par ${getUserNameAndOrganisation({
      user: pro,
    })}`;

    let addresses = [];
    let promotions = [];

    if (properties && properties.length) {
      addresses = properties.map(({ address1 }) => address1);
    }

    if (propertyIds && propertyIds.length) {
      addresses = [
        ...addresses,
        ...propertyIds.map(
          id => PropertyService.findOne(id, { address1: 1 }).address1,
        ),
      ];
    }

    if (promotionIds && promotionIds.length) {
      promotions = promotionIds.map(
        id => PromotionService.findOne(id, { name: 1 }).name,
      );
    }

    if (addresses.length) {
      const formattedAddresses = [
        addresses.slice(0, -1).join(', '),
        addresses.slice(-1)[0],
      ].join(addresses.length < 2 ? '' : ' et ');

      taskDescription = `${taskDescription}. Invité sur ${
        addresses.length === 1
          ? 'le bien immobilier: '
          : 'les biens immobiliers: '
        } ${formattedAddresses}`;
    }

    if (promotions.length) {
      const formattedPromotions = [
        promotions.slice(0, -1).join(', '),
        promotions.slice(-1)[0],
      ].join(promotions.length < 2 ? '' : ' et');

      taskDescription = `${taskDescription}. Invité sur ${
        promotions.length === 1 ? 'la promotion: ' : 'les promotions: '
        } ${formattedPromotions}`;
    }

    if (invitationNote) {
      taskDescription = `${taskDescription}. Note du referral: ${invitationNote}`;
    }

    if (isNewUser) {
      newUserTask({
        userId,
        description: taskDescription,
      });
    } else {
      TaskService.insert({
        object: {
          title: "Invitation d'un client déjà existant",
          docId: userId,
          collection: USERS_COLLECTION,
          description: taskDescription,
        },
      });
    }
  },
);

ServerEventService.addAfterMethodListener(
  loanShareSolvency,
  ({ context, params: { shareSolvency, loanId } }) => {
    context.unblock();

    if (shareSolvency) {
      TaskService.insert({
        object: {
          collection: LOANS_COLLECTION,
          docId: loanId,
          title:
            'Contacter le courtier du client pour lui parler de la solvabilité',
        },
      });
    }
  },
);

ServerEventService.addAfterMethodListener(
  generateTenDayExpirationReminderTasks,
  ({ result: promotionOptions = [] }) => {
    promotionOptions.forEach(promotionOption => {
      const {
        promotion: { assignedEmployee },
        promotionLots = [],
        reservationAgreement: { expirationDate },
        loan: {
          _id: loanId,
          user: { name: userName },
        },
      } = promotionOption;

      const [{ name: promotionLotName }] = promotionLots;

      TaskService.insert({
        object: {
          collection: LOANS_COLLECTION,
          docId: loanId,
          assigneeLink: assignedEmployee,
          title: `La réservation de ${userName} sur le lot ${promotionLotName} échoue dans 10 jours, relancer le client`,
          description: `La convention de réservation est valable jusqu'au ${moment(
            expirationDate,
          ).format('DD MMM')}`,
        },
      });
    });
  },
);

ServerEventService.addAfterMethodListener(
  generateExpiringSoonReservationTasks,
  ({ result: promotionOptions = [] }) => {
    promotionOptions.forEach(promotionOption => {
      const {
        promotion: { assignedEmployee },
        promotionLots = [],
        reservationAgreement: { expirationDate },
        loan: {
          _id: loanId,
          user: { name: userName },
        },
      } = promotionOption;

      const [{ name: promotionLotName }] = promotionLots;

      TaskService.insert({
        object: {
          collection: LOANS_COLLECTION,
          docId: loanId,
          assigneeLink: assignedEmployee,
          title: `La réservation de ${userName} sur le lot ${promotionLotName} arrive à échéance`,
          description: `La convention de réservation est valable jusqu'au ${moment(
            expirationDate,
          ).format('DD MMM')}`,
        },
      });
    });
  },
);

ServerEventService.addAfterMethodListener(
  setMaxPropertyValueWithoutBorrowRatio,
  ({ params, result: { isRecalculate } }) => {
    const { loanId } = params;
    const {
      hasPromotion,
      promotions = [],
      user: { name: userName } = {},
    } = LoanService.get(loanId, {
      hasPromotion: 1,
      promotions: { assignedEmployee: { email: 1 } },
      user: { name: 1 },
    });

    if (hasPromotion && !isRecalculate) {
      const [{ assignedEmployee }] = promotions;

      TaskService.insert({
        object: {
          collection: LOANS_COLLECTION,
          docId: loanId,
          assigneeLink: assignedEmployee,
          title: `Le client ${userName} a effectué un calcul de solvabilité`,
          description:
            "Identifier s'il est nécessaire de le contacter pour valider son attestation préliminaire de financement et s'assurer qu'il ait établi une demande de réservation",
        },
      });
    }
  },
);
