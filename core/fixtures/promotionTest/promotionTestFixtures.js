import { Random } from 'meteor/random';

import faker from 'faker/locale/fr';
import random from 'lodash/random';
import shuffle from 'lodash/shuffle';
import moment from 'moment';

import generator from '../../api/factories/server';
import LoanService from '../../api/loans/server/LoanService';
import { LOT_TYPES } from '../../api/lots/lotConstants';
import LotService from '../../api/lots/server/LotService';
import {
  ORGANISATION_FEATURES,
  ORGANISATION_TYPES,
} from '../../api/organisations/organisationConstants';
import OrganisationService from '../../api/organisations/server/OrganisationService';
import { PROMOTION_LOT_STATUS } from '../../api/promotionLots/promotionLotConstants';
import PromotionLotService from '../../api/promotionLots/server/PromotionLotService';
import {
  PROMOTION_OPTION_AGREEMENT_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
  PROMOTION_OPTION_DEPOSIT_STATUS,
  PROMOTION_OPTION_FULL_VERIFICATION_STATUS,
  PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS,
  PROMOTION_OPTION_STATUS,
} from '../../api/promotionOptions/promotionOptionConstants';
import { PROMOTION_USERS_ROLES } from '../../api/promotions/promotionConstants';
import PromotionService from '../../api/promotions/server/PromotionService';
import UserService from '../../api/users/server/UserService';
import { ROLES } from '../../api/users/userConstants';
import { addUser } from '../userFixtures';
import {
  DEMO_PROMOTION,
  NOTARY_ORGANISATION,
  NOTARY_ORGANISATION_NAME,
  PERMISSIONS,
  PROMOTER_ORGANISATION,
  PROMOTER_ORGANISATION_NAME,
} from './constants';

const zeroPadding = (num, places) => {
  const zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join('0') + num;
};

// Must implement this because the loans are inserted in parallel
const getNewLoanName = lastLoanName => {
  const now = new Date();
  const year = now.getYear();
  const yearPrefix = year - 100;

  if (!lastLoanName) {
    return `${yearPrefix}-0001`;
  }

  const [lastPrefix, count] = lastLoanName
    .split('-')
    .map(numb => parseInt(numb, 10));

  if (lastPrefix !== yearPrefix) {
    return `${yearPrefix}-0001`;
  }

  const nextCountString = zeroPadding(count + 1, 4);

  return `${yearPrefix}-${nextCountString}`;
};

// Adds 2 "static" pro users to the promotion
// The promoter and the notary
const addPromotionStaticPros = ({ promotionId }) => {
  let promoterOrganisation = OrganisationService.get(
    { name: PROMOTER_ORGANISATION_NAME },
    { _id: 1 },
  )?._id;

  let notaryOrganisation = OrganisationService.get(
    { name: NOTARY_ORGANISATION_NAME },
    { _id: 1 },
  )?._id;

  if (!promoterOrganisation) {
    promoterOrganisation = OrganisationService.insert(PROMOTER_ORGANISATION);
  }

  if (!notaryOrganisation) {
    notaryOrganisation = OrganisationService.insert(NOTARY_ORGANISATION);
  }

  const pros = [
    {
      email: 'promoter@e-potek.ch',
      role: PROMOTION_USERS_ROLES.PROMOTER,
      orgId: promoterOrganisation,
    },
    {
      email: 'notary@e-potek.ch',
      role: PROMOTION_USERS_ROLES.NOTARY,
      orgId: notaryOrganisation,
    },
  ];

  return Promise.all(
    pros.map(async ({ email, role, orgId }) => {
      const userId = await addUser({ email, role: ROLES.PRO });
      await PromotionService.addProUser({
        promotionId,
        userId,
        permissions: PERMISSIONS[role],
        orgId,
      });
      await PromotionService.updateUserRoles({
        promotionId,
        userId,
        roles: [role],
      });
      return userId;
    }),
  );
};

// Creates twice less organisations than the number of brokers
const createOrganisations = ({ pros }) => {
  const organisationsCount = Math.floor(pros / 2);

  return Promise.all(
    [...Array(organisationsCount)].map(async (_, index) => {
      const organisationName = `Organisation ${index + 1}`;
      let organisationId = OrganisationService.get(
        { name: organisationName },
        { _id: 1 },
      )?._id;

      if (!organisationId) {
        organisationId = await OrganisationService.insert({
          name: organisationName,
          type: ORGANISATION_TYPES.REAL_ESTATE_BROKER,
          features: [ORGANISATION_FEATURES.PRO],
        });
      }

      return organisationId;
    }),
  );
};

// Adds all the pro users to the promotion
const addProsToPromotion = async ({ promotionId, pros }) => {
  await addPromotionStaticPros({ promotionId });
  const organisationIds = await createOrganisations({ pros });
  const organisationsCount = organisationIds.length;

  // Adds the brokers
  return Promise.all(
    [...Array(pros)].map(async (_, index) => {
      // Choose a random organisation for this broker
      const organisationIndex = random(0, organisationsCount);
      const userId = await addUser({
        email: `broker${index + 1}@org${organisationIndex + 1}.com`,
        role: ROLES.PRO,
      });
      await PromotionService.addProUser({
        promotionId,
        userId,
        permissions: PERMISSIONS.BROKER,
      });
      await PromotionService.updateUserRoles({
        promotionId,
        userId,
        roles: [PROMOTION_USERS_ROLES.BROKER],
        orgId: organisationIds[organisationIndex],
      });

      return userId;
    }),
  );
};

// Adds 3 additionnal lots and link 2 to a promotion lot
const createAdditionalLots = ({
  promotionId,
  promotionLotId,
  promotionLotIndex,
}) =>
  Promise.all(
    [...Array(3)].map(async (_, index) => {
      const lotId = await LotService.insert({
        name: `A-${promotionLotIndex}-${index + 1}`,
        // Randomly set a value between 10k-50k (10k increments)
        value: random(1, 5) * 10000,
        // Randomly set the lot type
        type: random(0, 10) > 5 ? LOT_TYPES.PARKING_CAR : LOT_TYPES.BASEMENT,
      });
      PromotionService.addLink({
        id: promotionId,
        linkName: 'lots',
        linkId: lotId,
      });

      // Only link 2 additional lots to the promotion lot
      if (index % 3 !== 0) {
        PromotionLotService.addLink({
          id: promotionLotId,
          linkName: 'lots',
          linkId: lotId,
        });
      }

      return lotId;
    }),
  );

// Adds the promotion lots
const createLots = ({ promotionId, lots }) =>
  Promise.all(
    [...Array(lots)].map(async (_, index) => {
      const promotionLotId = await PromotionService.insertPromotionProperty({
        promotionId,
        property: {
          name: `${zeroPadding(index + 1, 3)}`,
          // Randomly set the total value between 610k-1300k
          landValue: random(1, 2) * 100000,
          constructionValue: random(5, 10) * 100000,
          additionalMargin: random(1, 10) * 10000,
        },
      });

      await createAdditionalLots({
        promotionId,
        promotionLotId,
        promotionLotIndex: zeroPadding(index + 1, 3),
      });

      return promotionLotId;
    }),
  );

// Adds the users to the promotion with their promotionOptions
const createUsers = async ({
  promotionId,
  proIds,
  lotIds,
  users,
  promotionOptionsPerUser,
}) => {
  const today = new Date();
  const { name: lastLoanName } = await LoanService.get(
    {},
    { name: 1, $options: { sort: { name: -1 } } },
  );
  let nextLoanName = getNewLoanName(lastLoanName);

  await generator({
    users: [...Array(users)].map(() => {
      // Assign a random broker
      const [proId] = shuffle(proIds);

      // Select random promotion lots
      const promotionLotIds = shuffle(lotIds).slice(0, promotionOptionsPerUser);

      const promotionOptions = promotionLotIds.map(promotionLotId => ({
        // Manually set the _id, to set the priority order afterwards
        _id: Random.id(),

        // Set a random status (not SOLD or RESERVED)
        status: shuffle([
          PROMOTION_OPTION_STATUS.INTERESTED,
          PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
          PROMOTION_OPTION_STATUS.RESERVATION_CANCELLED,
          PROMOTION_OPTION_STATUS.RESERVATION_WAITLIST,
          PROMOTION_OPTION_STATUS.RESERVATION_EXPIRED,
        ])[0],
        promotion: { _id: promotionId },
        promotionLotLinks: [{ _id: promotionLotId }],

        // Complete all the steps in order to not have an error when trying to complete a reservation later on
        reservationAgreement: {
          status: PROMOTION_OPTION_AGREEMENT_STATUS.RECEIVED,
          date: today,
          startDate: today,
          expirationDate: moment(today)
            .add(30, 'days')
            .valueOf(),
        },
        reservationDeposit: {
          status: PROMOTION_OPTION_DEPOSIT_STATUS.PAID,
          date: today,
        },
        bank: { status: PROMOTION_OPTION_BANK_STATUS.VALIDATED, date: today },
        simpleVerification: {
          status: PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.VALIDATED,
          date: today,
        },
        fullVerification: {
          status: PROMOTION_OPTION_FULL_VERIFICATION_STATUS.VALIDATED,
          date: today,
        },
      }));

      const loanName = nextLoanName;
      nextLoanName = getNewLoanName(loanName);

      return {
        _factory: 'user',
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        emails: [{ address: `${Random.id()}@e-potek.ch`, verified: true }],
        loans: {
          name: loanName,
          promotionLinks: [
            {
              _id: promotionId,
              invitedBy: proId,
              priorityOrder: promotionOptions.map(({ _id }) => _id),
            },
          ],
          promotionOptions,
        },
      };
    }),
  });
};

// Loops through all the promotion lots and randomly sell/reserve the lot to a random promotion option
// or let it available
const sellAndReserveLots = ({ lotIds }) =>
  Promise.all(
    lotIds.map(async lotId => {
      // Get all the promotion options for this promotion lot
      const { promotionOptions = [] } = await PromotionLotService.get(lotId, {
        promotionOptions: { status: 1 },
      });

      // Randomly choose the next promotion lot status
      const [promotionLotStatus] = shuffle(Object.keys(PROMOTION_LOT_STATUS));

      // Randomly choose a promotion option to be attributed to this promotion lot
      const [{ _id: selectedPromotionOption } = {}] = shuffle(
        promotionOptions.filter(
          ({ status }) =>
            status !== PROMOTION_OPTION_STATUS.RESERVATION_CANCELLED,
        ),
      );

      if (selectedPromotionOption) {
        if (promotionLotStatus === PROMOTION_LOT_STATUS.SOLD) {
          // Must reserve the lot before selling it to set attributedTo
          await PromotionLotService.reservePromotionLot({
            promotionOptionId: selectedPromotionOption,
          });
          await PromotionLotService.sellPromotionLot({
            promotionOptionId: selectedPromotionOption,
          });
        }

        if (promotionLotStatus === PROMOTION_LOT_STATUS.RESERVED) {
          await PromotionLotService.reservePromotionLot({
            promotionOptionId: selectedPromotionOption,
          });
        }
      }
    }),
  );

export const createTestPromotion = async ({
  lots = 50,
  users = 25,
  pros = 10,
  promotionOptionsPerUser = 3,
} = {}) => {
  console.log('Creating test promotion...');
  // Select a random promotion assignee
  const admin = UserService.get({ 'roles._id': ROLES.ADVISOR }, { _id: 1 });

  const promotionId = await PromotionService.insert({
    promotion: {
      ...DEMO_PROMOTION,
      assignedEmployeeId: admin?._id,
    },
  });

  console.log('Adding pro users...');
  const proIds = await addProsToPromotion({ promotionId, pros });

  console.log('Adding lots...');
  const lotIds = await createLots({ promotionId, lots });

  console.log('Adding users...');
  await createUsers({
    promotionId,
    proIds,
    lotIds,
    users,
    promotionOptionsPerUser,
  });

  console.log('Selling and reserving lots...');
  await sellAndReserveLots({ lotIds });

  console.log('Done creating test promo !');

  return Promise.resolve(promotionId);
};
