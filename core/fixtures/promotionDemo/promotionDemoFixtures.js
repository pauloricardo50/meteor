import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import range from 'lodash/range';
import random from 'lodash/random';
import shuffle from 'lodash/shuffle';
import faker from 'faker/locale/fr';

import LoanService from '../../api/loans/LoanService';
import PromotionService from '../../api/promotions/PromotionService';
import {
  PROMOTION_TYPES,
  PROMOTION_STATUS,
} from '../../api/promotions/promotionConstants';
import UserService from '../../api/users/UserService';
import { ROLES } from '../../api/users/userConstants';
import PromotionOptionService from '../../api/promotionOptions/PromotionOptionService';
import PromotionLotService from '../../api/promotionLots/PromotionLotService';
import LotService from '../../api/lots/LotService';
import { LOT_TYPES, PROMOTION_OPTION_STATUS } from '../../api/constants';
import { properties } from './data';

const DEMO_PROMOTION = {
  name: 'Pré Polly',
  type: PROMOTION_TYPES.SHARE,
  status: PROMOTION_STATUS.PREPARATION,
  address1: 'Chemin de Pré-Polly 1',
  zipCode: 1233,
  city: 'Bernex',
};

const rand = arr => arr[random(0, arr.length - 1)];

export const createPromotionDemoUser = () => {
  console.log('Creating promotion demo user...');
  const userId = Accounts.createUser({
    email: 'demo-promotion@epotek.ch',
    password: '123456',
  });

  UserService.update({
    userId,
    object: { firstName: 'Marc', lastName: 'Dubois' },
  });

  return userId;
};

export const createPromotionDemoOwner = () => {
  console.log('Creating promotion demo owner...');
  const ownerId = Accounts.createUser({
    email: 'demo-promotion-owner@epotek.ch',
    password: '123456',
  });

  Roles.setUserRoles(ownerId, ROLES.PRO);

  UserService.update({
    userId: ownerId,
    object: { firstName: 'Jean', lastName: 'Duvoisin' },
  });

  return ownerId;
};

export const createPromotionDemoViewer = () => {
  console.log('Creating promotion demo viewer...');
  const viewerId = Accounts.createUser({
    email: 'demo-promotion-viewer@epotek.ch',
    password: '123456',
  });

  Roles.setUserRoles(viewerId, ROLES.PRO);

  UserService.update({
    userId: viewerId,
    object: { firstName: 'Marie', lastName: 'Lemarchand' },
  });

  return viewerId;
};

const createLots = (promotionId) => {
  properties.forEach(({ name, value, lots }) => {
    const promotionLotId = PromotionService.insertPromotionProperty({
      promotionId,
      property: { name, value },
    });
    const lotIds = lots.map(lotName =>
      LotService.insert({
        name: lotName,
        value: 0,
        type:
          Number.parseInt(lotName, 10) > 0
            ? LOT_TYPES.PARKING_CAR
            : LOT_TYPES.BASEMENT,
      }));
    lotIds.forEach(lotId =>
      PromotionLotService.addLink({
        id: promotionLotId,
        linkName: 'lotLinks',
        linkId: lotId,
      }));
    lotIds.forEach(lotId =>
      PromotionService.addLink({
        id: promotionId,
        linkName: 'lotLinks',
        linkId: lotId,
      }));
  });
};

const getDistinctRandomValues = (arr, amount) => shuffle(arr).slice(0, amount);

const addPromotionOptions = (loanId, promotion) => {
  const amount = random(1, 3);
  console.log('amount', amount);
  return getDistinctRandomValues(promotion.promotionLotLinks, amount).map(({ _id: promotionLotId }) => {
    const promotionOptionId = PromotionOptionService.insert({
      loanId,
      promotionLotId,
    });
    PromotionOptionService.update({
      promotionOptionId,
      object: {
        status:
            Math.random() > 0.66
              ? PROMOTION_OPTION_STATUS.WANT_TO_BUY
              : PROMOTION_OPTION_STATUS.TRIAL,
      },
    });
    return promotionOptionId;
  });
};

export const createPromotionDemo = (
  userId,
  addCurrentUser,
  withPromotionOptions,
) => {
  console.log('Creating promotion demo...');
  const promotionId = PromotionService.insert({
    promotion: DEMO_PROMOTION,
    userId,
  });

  console.log('creating lots');
  createLots(promotionId);

  const promotion = PromotionService.get(promotionId);

  if (addCurrentUser) {
    console.log('Adding current user');

    const loanId = PromotionService.inviteUser({
      promotionId,
      userId,
    });
    if (withPromotionOptions) {
      const promotionOptionIds = addPromotionOptions(loanId, promotion);
      LoanService.setPromotionPriorityOrder({
        loanId,
        promotionId,
        priorityOrder: promotionOptionIds,
      });
    }
  }

  console.log('creating users');
  range(50).forEach((i) => {
    const promotionCustomerId = UserService.createUser({
      role: ROLES.USER,
      options: {
        email: `user-${i}@e-potek.ch`,
        password: '12345',
      },
    });

    UserService.update({
      userId: promotionCustomerId,
      object: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phoneNumbers: [faker.phone.phoneNumber()],
      },
    });

    const loanId = PromotionService.inviteUser({
      promotionId,
      userId: promotionCustomerId,
    });
    const promotionOptionIds = addPromotionOptions(loanId, promotion);
    console.log('promotionOptionIds', promotionOptionIds);
    LoanService.setPromotionPriorityOrder({
      loanId,
      promotionId,
      priorityOrder: promotionOptionIds,
    });
  });
};
