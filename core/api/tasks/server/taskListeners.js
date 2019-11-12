import moment from 'moment';

import PropertyService from 'core/api/properties/server/PropertyService';
import PromotionService from 'core/api/promotions/server/PromotionService';
import PromotionOptionService from 'core/api/promotionOptions/server/PromotionOptionService';
import {
  generateExpiringSoonReservationTasks,
  generateHalfLifeReservationReminderTasks,
} from 'core/api/promotionOptions/server/methods';
import { getUserNameAndOrganisation } from '../../helpers';
import UserService from '../../users/server/UserService';
import ServerEventService from '../../events/server/ServerEventService';
import {
  adminCreateUser,
  anonymousCreateUser,
  proInviteUser,
  loanShareSolvency,
  reservePromotionLot,
} from '../../methods';
import {
  LOANS_COLLECTION,
  USERS_COLLECTION,
  PROMOTIONS_COLLECTION,
} from '../../constants';
import TaskService from './TaskService';

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
  async ({
    result,
    context,
    params: { invitationNote, properties, propertyIds, promotionIds },
  }) => {
    const { userId: proId } = context;
    context.unblock();

    if (result) {
      if (typeof result.then === 'function') {
        // The result of the meteor method can be a promise
        result = await result;
      }

      const { userId } = result;

      const user = UserService.fetchOne({
        $filters: { _id: userId },
        assignedEmployeeId: 1,
        createdAt: 1,
      });
      const pro = UserService.get(proId);

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
          ...propertyIds.map(id => PropertyService.get(id).address1),
        ];
      }

      if (promotionIds && promotionIds.length) {
        promotions = promotionIds.map(id => PromotionService.get(id).name);
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
    }
  },
);

ServerEventService.addAfterMethodListener(
  [loanShareSolvency],
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
  [reservePromotionLot],
  ({ context: { userId }, params: { promotionOptionId } }) => {
    const {
      loan: { _id: loanId, user: { name: userName } = {} },
      promotionLots = [],
      promotion: { name: promotionName } = {},
    } = PromotionOptionService.fetchOne({
      $filters: { _id: promotionOptionId },
      loan: { user: { name: 1 } },
      promotionLots: { name: 1 },
      promotion: { name: 1 },
    });
    const { name: proName } = UserService.fetchOne({
      $filters: { _id: userId },
      name: 1,
    });
    const [{ name: promotionLotName }] = promotionLots;

    TaskService.insert({
      object: {
        collection: LOANS_COLLECTION,
        docId: loanId,
        title: 'Nouvelle réservation, prendre contact',
        description: `Le lot "${promotionLotName}" de la promotion "${promotionName}" est en cours de réservation pour ${userName} par ${proName}`,
      },
    });
  },
);

ServerEventService.addAfterMethodListener(
  generateExpiringSoonReservationTasks,
  ({ result: promotionOptions = [] }) => {
    promotionOptions.forEach(promotionOption => {
      const {
        promotion: { _id: promotionId, assignedEmployee },
        promotionLots = [],
        reservationAgreement: { expirationDate },
        loan: {
          user: { name: userName },
        },
      } = promotionOption;

      const [{ name: promotionLotName }] = promotionLots;

      TaskService.insert({
        object: {
          collection: PROMOTIONS_COLLECTION,
          docId: promotionId,
          assigneeLink: assignedEmployee,
          title: `La réservation de ${userName} sur ${promotionLotName} arrive à échéance`,
          description: `Valable jusqu'au ${moment(expirationDate).format(
            'DD MMM',
          )}`,
        },
      });
    });
  },
);

ServerEventService.addAfterMethodListener(
  generateHalfLifeReservationReminderTasks,
  ({ result: promotionOptions = [] }) => {
    promotionOptions.forEach(promotionOption => {
      const {
        promotion: { _id: promotionId, assignedEmployee },
        promotionLots = [],
        reservationAgreement: { expirationDate },
        loan: {
          user: { name: userName },
        },
      } = promotionOption;

      const [{ name: promotionLotName }] = promotionLots;

      TaskService.insert({
        object: {
          collection: PROMOTIONS_COLLECTION,
          docId: promotionId,
          assigneeLink: assignedEmployee,
          title: `La réservation de ${userName} sur ${promotionLotName} échoue dans 10 jours, relancer le client`,
          description: `Valable jusqu'au ${moment(expirationDate).format(
            'DD MMM',
          )}`,
        },
      });
    });
  },
);
