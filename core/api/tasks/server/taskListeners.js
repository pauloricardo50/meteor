import PropertyService from 'core/api/properties/server/PropertyService';
import PromotionService from 'core/api/promotions/server/PromotionService';
import { getUserNameAndOrganisation } from '../../helpers';
import UserService from '../../users/server/UserService';
import ServerEventService from '../../events/server/ServerEventService';
import {
  requestLoanVerification,
  adminCreateUser,
  anonymousCreateUser,
  proInviteUser,
  loanShareSolvency,
} from '../../methods';
import { LOANS_COLLECTION, USERS_COLLECTION } from '../../constants';
import TaskService from './TaskService';

ServerEventService.addAfterMethodListener(
  requestLoanVerification,
  ({ params: { loanId } }) => {
    TaskService.insert({
      object: {
        title: 'Vérification du dossier demandée',
        docId: loanId,
        collection: LOANS_COLLECTION,
      },
    });
  },
);

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
  ({ result: userId }) => {
    if (userId) {
      const user = UserService.fetchOne({
        $filters: { _id: userId },
        assignedEmployeeId: 1,
      });

      newUserTask({ userId });
    }
  },
);

ServerEventService.addAfterMethodListener(
  proInviteUser,
  async ({
    result: userId,
    context: { userId: proId },
    params: { invitationNote, properties, propertyIds, promotionIds },
  }) => {
    if (userId) {
      if (typeof userId.then === 'function') {
        // The result of the meteor method can be a promise
        userId = await userId;
      }

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
  ({ params: { shareSolvency, loanId } }) => {
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
