import { Random } from 'meteor/random';

import random from 'lodash/random';
import shuffle from 'lodash/shuffle';
import moment from 'moment';

import generator from '../api/factories/server';
import { zeroPadding } from '../api/helpers/server/collectionServerHelpers';
import LoanService from '../api/loans/server/LoanService';
import { LOT_TYPES } from '../api/lots/lotConstants';
import {
  ORGANISATION_FEATURES,
  ORGANISATION_TYPES,
} from '../api/organisations/organisationConstants';
import OrganisationService from '../api/organisations/server/OrganisationService';
import { PROMOTION_LOT_STATUS } from '../api/promotionLots/promotionLotConstants';
import PromotionLotService from '../api/promotionLots/server/PromotionLotService';
import {
  PROMOTION_OPTION_AGREEMENT_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
  PROMOTION_OPTION_DEPOSIT_STATUS,
  PROMOTION_OPTION_FULL_VERIFICATION_STATUS,
  PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS,
  PROMOTION_OPTION_STATUS,
} from '../api/promotionOptions/promotionOptionConstants';
import { PROMOTION_USERS_ROLES } from '../api/promotions/promotionConstants';
import PromotionService from '../api/promotions/server/PromotionService';
import UserService from '../api/users/server/UserService';
import { ROLES } from '../api/users/userConstants';
import {
  DEMO_PROMOTION,
  NOTARY_ORGANISATION,
  NOTARY_ORGANISATION_NAME,
  PERMISSIONS,
  PROMOTER_ORGANISATION,
  PROMOTER_ORGANISATION_NAME,
} from './promotionFixturesConstants';
import { addUser } from './userFixtures';

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

  pros.forEach(({ email, role, orgId }) => {
    const userId = addUser({
      email,
      role: ROLES.PRO,
      orgId,
    });
    PromotionService.addProUser({
      promotionId,
      userId,
      permissions: PERMISSIONS[role],
    });
    PromotionService.updateUserRoles({
      promotionId,
      userId,
      roles: [role],
    });
  });
};

// Creates twice less organisations than the number of brokers
const createOrganisations = ({ pros }) => {
  const organisationsCount = Math.floor(pros / 2);

  return [...Array(organisationsCount)].map((_, index) => {
    const organisationName = `Organisation ${index + 1}`;
    let organisationId = OrganisationService.get(
      { name: organisationName },
      { _id: 1 },
    )?._id;

    if (!organisationId) {
      organisationId = OrganisationService.insert({
        name: organisationName,
        type: ORGANISATION_TYPES.REAL_ESTATE_BROKER,
        features: [ORGANISATION_FEATURES.PRO],
      });
    }

    return organisationId;
  });
};

// Adds all the pro users to the promotion
const addProsToPromotion = ({ promotionId, pros }) => {
  addPromotionStaticPros({ promotionId });
  const organisationIds = createOrganisations({ pros });
  const organisationsCount = organisationIds.length;

  // Adds the brokers
  return [...Array(pros)].map((_, index) => {
    // Choose a random organisation for this broker
    const organisationIndex = random(0, organisationsCount - 1);
    const userId = addUser({
      email: `broker${index + 1}@org${organisationIndex + 1}.com`,
      role: ROLES.PRO,
      orgId: organisationIds[organisationIndex],
    });
    PromotionService.addProUser({
      promotionId,
      userId,
      permissions: PERMISSIONS.BROKER,
    });
    PromotionService.updateUserRoles({
      promotionId,
      userId,
      roles: [PROMOTION_USERS_ROLES.BROKER],
    });

    return userId;
  });
};

// Adds the promotion lots
const createLots = ({ promotionId, lots }) => {
  let promotionLotIds = [];

  const { address1, zipCode, city, canton } = PromotionService.get(
    promotionId,
    { address1: 1, zipCode: 1, city: 1, canton: 1 },
  );

  generator({
    promotionLots: [...Array(lots)].map((_, index) => {
      const promotionLotId = Random.id();
      promotionLotIds = [...promotionLotIds, promotionLotId];
      const promotionLotName = zeroPadding(index + 1, 3);

      return {
        _id: promotionLotId,
        promotion: { _id: promotionId },
        properties: [
          {
            name: promotionLotName,
            address1,
            zipCode,
            city,
            canton,
            // Randomly set the total value between 610k-1300k
            landValue: random(1, 2) * 100000,
            constructionValue: random(5, 10) * 100000,
            additionalMargin: random(1, 10) * 10000,
            promotion: { _id: promotionId },
            lots: [...Array(2)].map((_, i) => ({
              name: `A-${promotionLotName}-${i + 1}`,
              // Randomly set a value between 10k-50k (10k increments)
              value: random(1, 5) * 10000,
              type: i === 0 ? LOT_TYPES.PARKING_CAR : LOT_TYPES.BASEMENT,
              promotion: { _id: promotionId },
            })),
          },
        ],
      };
    }),
  });

  return promotionLotIds;
};

// Adds the users to the promotion with their promotionOptions
const createUsers = ({
  promotionId,
  proIds,
  lotIds,
  users,
  promotionOptionsPerUser,
}) => {
  const today = new Date();
  const { name: lastLoanName } =
    LoanService.get({}, { name: 1, $options: { sort: { name: -1 } } }) || {};
  let nextLoanName = getNewLoanName(lastLoanName);

  generator({
    users: [...Array(users)].map(() => {
      // Assign a random broker
      const [proId] = shuffle(proIds);

      // Select random promotion lots
      const promotionOptionsCount = random(1, promotionOptionsPerUser);
      const promotionLotIds = shuffle(lotIds).slice(0, promotionOptionsCount);

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
          expirationDate: moment(today).add(30, 'days').valueOf(),
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
  lotIds.map(lotId => {
    // Get all the promotion options for this promotion lot
    const { promotionOptions = [] } = PromotionLotService.get(lotId, {
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
        PromotionLotService.reservePromotionLot({
          promotionOptionId: selectedPromotionOption,
        });
        PromotionLotService.sellPromotionLot({
          promotionOptionId: selectedPromotionOption,
        });
      }

      if (promotionLotStatus === PROMOTION_LOT_STATUS.RESERVED) {
        PromotionLotService.reservePromotionLot({
          promotionOptionId: selectedPromotionOption,
        });
      }
    }
  });

export const createTestPromotion = ({
  lots,
  users,
  pros,
  promotionOptionsPerUser,
  promotionName,
} = {}) => {
  console.log('Creating test promotion...');
  // Select a random promotion assignee
  const admin = UserService.get({ 'roles._id': ROLES.ADVISOR }, { _id: 1 });

  const promotionId = PromotionService.insert({
    promotion: {
      ...DEMO_PROMOTION,
      name: promotionName,
      assignedEmployeeId: admin?._id,
    },
  });

  console.log('Adding pro users...');
  const proIds = addProsToPromotion({ promotionId, pros });

  console.log('Adding lots...');
  const lotIds = createLots({ promotionId, lots });

  console.log('Adding users...');
  createUsers({
    promotionId,
    proIds,
    lotIds,
    users,
    promotionOptionsPerUser,
  });

  console.log('Selling and reserving lots...');
  sellAndReserveLots({ lotIds });

  console.log('Done creating test promo !');

  return Promise.resolve(promotionId);
};
