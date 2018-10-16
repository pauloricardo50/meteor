import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';

import {
  STEPS,
  TASK_STATUS,
  TASK_TYPE,
  PROMOTION_USER_PERMISSIONS,
  PROMOTION_TYPES,
  PROMOTION_OPTION_STATUS,
} from './constants';
import {
  Borrowers,
  Loans,
  Offers,
  PromotionLots,
  PromotionOptions,
  Promotions,
  Properties,
  Tasks,
  Users,
  Lots,
} from '.';
import { PROMOTION_LOT_STATUS } from './promotionLots/promotionLotConstants';
import { LOT_TYPES } from './lots/lotConstants';

const TEST_LASTNAME = 'TestLastName';
const TEST_FIRSTNAME = 'TestFirstName';
const TEST_PHONE = '0123456789';

Factory.define('user', Users, {
  roles: () => 'user',
  emails: () => [{ address: faker.internet.email(), verified: false }],
  lastName: TEST_LASTNAME,
  firstName: TEST_FIRSTNAME,
  phoneNumbers: [TEST_PHONE],
});

Factory.define('dev', Users, {
  roles: () => 'dev',
  emails: () => [{ address: faker.internet.email(), verified: false }],
  lastName: TEST_LASTNAME,
  firstName: TEST_FIRSTNAME,
  phoneNumbers: [TEST_PHONE],
});

Factory.define('admin', Users, {
  roles: () => 'admin',
  emails: () => [{ address: faker.internet.email(), verified: false }],
  lastName: TEST_LASTNAME,
  firstName: TEST_FIRSTNAME,
  phoneNumbers: [TEST_PHONE],
});

Factory.define('borrower', Borrowers);

Factory.define('task', Tasks, {
  type: TASK_TYPE.USER_ADDED_FILE,
  createdAt: () => new Date(),
  status: TASK_STATUS.ACTIVE,
  documentId: 'aDocumentId',
});

Factory.define('loan', Loans, {
  createdAt: () => new Date(),
  borrowerIds: [],
  documents: () => ({}),
  logic: () => ({
    verification: {},
    step: STEPS.PREPARATION,
  }),
  name: () => faker.random.uuid(),
  emails: () => [],
  propertyIds: [],
});

Factory.define('property', Properties, {
  value: 1000000,
});

Factory.define('offer', Offers, {
  userId: () => faker.random.uuid(),
  createdAt: () => new Date(),
  organization: 'bankName',
  canton: 'GE',
  conditions: ['Do something'],
  maxAmount: 800000,
  amortization: 10000,
});

Factory.define('promotion', Promotions, {
  name: 'Test promotion',
  type: PROMOTION_TYPES.CREDIT,
  userLinks: [
    { _id: 'userId', permissions: PROMOTION_USER_PERMISSIONS.MODIFY },
  ],
  promotionLotLinks: [{ _id: 'lotId' }],
});

Factory.define('promotionOption', PromotionOptions, {
  status: PROMOTION_OPTION_STATUS.TRIAL,
  promotionLotLinks: [{ _id: 'lotId' }],
});
Factory.define('promotionLot', PromotionLots, {
  propertyLinks: [{ _id: 'propertyId' }],
});

Factory.define('lot', Lots, {
  name: 'test',
  type: LOT_TYPES.PARKING_CAR,
  value: 1000,
});
