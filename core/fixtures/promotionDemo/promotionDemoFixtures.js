import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import range from 'lodash/range';
import random from 'lodash/random';
import shuffle from 'lodash/shuffle';
import faker from 'faker/locale/fr';

import LoanService from '../../api/loans/server/LoanService';
import PromotionService from '../../api/promotions/server/PromotionService';
import UserService from '../../api/users/server/UserService';
import PromotionOptionService from '../../api/promotionOptions/server/PromotionOptionService';
import PromotionLotService from '../../api/promotionLots/server/PromotionLotService';
import LotService from '../../api/lots/server/LotService';
import {
  LOT_TYPES,
  PROMOTION_TYPES,
  PROMOTION_STATUS,
  ROLES,
} from '../../api/constants';
import { properties } from './data';

const DEMO_PROMOTION = {
  name: 'Pré Polly',
  type: PROMOTION_TYPES.SHARE,
  status: PROMOTION_STATUS.OPEN,
  address1: 'Chemin de Pré-Polly 1',
  zipCode: 1233,
  city: 'Bernex',
  contacts: [
    {
      name: 'Marc Steiner',
      title: 'Commercialisation',
      email: 'marc@test.com',
      phoneNumber: '+41 21 800 90 70',
    },
    {
      name: 'Léo Dind',
      title: 'Architecte',
      email: 'leo@test.com',
      phoneNumber: '+41 58 999 21 21',
    },
  ],
};

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
        linkName: 'lots',
        linkId: lotId,
      }));
    lotIds.forEach(lotId =>
      PromotionService.addLink({
        id: promotionId,
        linkName: 'lots',
        linkId: lotId,
      }));
  });
};

const getDistinctRandomValues = (arr, amount) => shuffle(arr).slice(0, amount);

const addPromotionOptions = (loanId, promotion) => {
  const amount = random(1, 3);
  return getDistinctRandomValues(promotion.promotionLotLinks, amount).map(({ _id: promotionLotId }) => {
    const promotionOptionId = PromotionOptionService.insert({
      loanId,
      promotionLotId,
    });
    return promotionOptionId;
  });
};

export const createPromotionDemo = async (
  userId,
  addCurrentUser,
  withPromotionOptions,
  users,
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

    const loanId = await PromotionService.inviteUser({
      promotionId,
      user: { ...Meteor.user(), email: Meteor.user().emails[0].address },
      sendInvitation: false,
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
  range(users).forEach(async (i) => {
    console.log(`creating user ${i + 1}`);

    const user = {
      email: `user-${i}@e-potek.ch`,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phoneNumber: faker.phone.phoneNumber(),
    };

    const promotionCustomerId = UserService.createUser({
      role: ROLES.USER,
      options: {
        email: user.email,
        password: '12345',
      },
    });

    UserService.update({
      userId: promotionCustomerId,
      object: {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumbers: [user.phoneNumber],
      },
    });

    const loanId = await PromotionService.inviteUser({
      promotionId,
      user,
    });

    const promotionOptionIds = addPromotionOptions(loanId, promotion);
    LoanService.setPromotionPriorityOrder({
      loanId,
      promotionId,
      priorityOrder: promotionOptionIds,
    });
  });
  console.log('Done creating promotion');
};
