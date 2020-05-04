import { Meteor } from 'meteor/meteor';

import faker from 'faker/locale/fr';
import random from 'lodash/random';
import range from 'lodash/range';
import shuffle from 'lodash/shuffle';

import LoanService from '../../api/loans/server/LoanService';
import { LOT_TYPES } from '../../api/lots/lotConstants';
import LotService from '../../api/lots/server/LotService';
import { ORGANISATION_TYPES } from '../../api/organisations/organisationConstants';
import OrganisationService from '../../api/organisations/server/OrganisationService';
import PromotionLotService from '../../api/promotionLots/server/PromotionLotService';
import PromotionOptionService from '../../api/promotionOptions/server/PromotionOptionService';
import {
  PROMOTION_STATUS,
  PROMOTION_TYPES,
  PROMOTION_USERS_ROLES,
} from '../../api/promotions/promotionConstants';
import PromotionService from '../../api/promotions/server/PromotionService';
import UserService from '../../api/users/server/UserService';
import { ROLES } from '../../api/users/userConstants';
import { addUser } from '../userFixtures';
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
  agreementDuration: 30,
};

const createLots = promotionId => {
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
      }),
    );
    lotIds.forEach(lotId =>
      PromotionLotService.addLink({
        id: promotionLotId,
        linkName: 'lots',
        linkId: lotId,
      }),
    );
    lotIds.forEach(lotId =>
      PromotionService.addLink({
        id: promotionId,
        linkName: 'lots',
        linkId: lotId,
      }),
    );
  });
};

const getDistinctRandomValues = (arr, amount) => shuffle(arr).slice(0, amount);

const addPromotionOptions = (loanId, promotion) => {
  const amount = random(1, 3);
  return getDistinctRandomValues(promotion.promotionLotLinks, amount).map(
    ({ _id: promotionLotId }) => {
      const promotionOptionId = PromotionOptionService.insert({
        loanId,
        promotionLotId,
        promotionId: promotion._id,
      });
      return promotionOptionId;
    },
  );
};

const createUsers = async ({
  users,
  promotionId,
  promotion,
  withInvitedBy,
  proIds = [],
}) => {
  const brokerIds = proIds.slice(0, 2);

  console.log('creating users');
  const promises = [];
  for (let i = 0; i < range(users).length; i += 1) {
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
        password: '12345678',
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

    promises.push(
      PromotionService.inviteUser({
        promotionId,
        userId: promotionCustomerId,
        sendInvitation: false,
        pro: { _id: withInvitedBy ? Meteor.userId() : shuffle(brokerIds)[0] },
      }).then(loanId => {
        const promotionOptionIds = addPromotionOptions(loanId, promotion);
        LoanService.setPromotionPriorityOrder({
          loanId,
          promotionId,
          priorityOrder: promotionOptionIds,
        });
      }),
    );
  }

  await Promise.all(promises);
};

const addPromotionPros = ({ promotionId }) => {
  const users = [
    { email: 'broker1@e-potek.ch', roles: [PROMOTION_USERS_ROLES.BROKER] },
    { email: 'broker2@e-potek.ch', roles: [PROMOTION_USERS_ROLES.BROKER] },
    { email: 'promoter1@e-potek.ch', roles: [PROMOTION_USERS_ROLES.PROMOTER] },
    { email: 'visitor1@e-potek.ch', roles: [PROMOTION_USERS_ROLES.VISITOR] },
    { email: 'notary1@e-potek.ch', roles: [PROMOTION_USERS_ROLES.NOTARY] },
  ];
  let org1 = OrganisationService.get({ name: 'Promo org 1' }, { _id: 1 })?._id;
  let org2 = OrganisationService.get({ name: 'Promo org 2' }, { _id: 1 })?._id;

  if (!org1) {
    org1 = OrganisationService.insert({
      name: 'Promo org 1',
      type: ORGANISATION_TYPES.REAL_ESTATE_BROKER,
    });
  }
  if (!org2) {
    org2 = OrganisationService.insert({
      name: 'Promo org 2',
      type: ORGANISATION_TYPES.REAL_ESTATE_BROKER,
    });
  }

  return users.map(({ email, roles }) => {
    const userId = addUser({ email, role: ROLES.PRO });
    PromotionService.addProUser({ promotionId, userId });
    PromotionService.updateUserRoles({ promotionId, userId, roles });
    UserService.updateOrganisations({
      userId,
      newOrganisations: [
        { _id: email.includes('1') ? org1 : org2, metadata: { isMain: true } },
      ],
    });
    return userId;
  });
};

export const createPromotionDemo = async (
  userId,
  addCurrentUser,
  withPromotionOptions,
  users,
  withInvitedBy = false,
) => {
  console.log('Creating promotion demo...');
  const admin = UserService.get({ 'roles._id': ROLES.ADMIN }, { _id: 1 });

  console.log('admin:', admin);
  const promotionId = PromotionService.insert({
    promotion: { ...DEMO_PROMOTION, assignedEmployeeId: admin && admin._id },
    userId,
  });

  console.log('creating lots');
  createLots(promotionId);

  const promotion = PromotionService.get(promotionId, { promotionLotLinks: 1 });

  console.log('Adding promotion Pros');
  const proIds = addPromotionPros({ promotionId });

  if (addCurrentUser) {
    console.log('Adding current user');

    const loanId = await PromotionService.inviteUser({
      promotionId,
      userId: Meteor.userId(),
      sendInvitation: false,
      pro: { _id: proIds[0] },
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

  await createUsers({
    users,
    promotionId,
    promotion,
    withInvitedBy,
    proIds,
  });

  console.log('Done creating promotion');
};
