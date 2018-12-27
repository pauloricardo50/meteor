import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';

import {
  STEPS,
  TASK_STATUS,
  TASK_TYPE,
  DOCUMENT_USER_PERMISSIONS,
  PROMOTION_TYPES,
  PROMOTION_OPTION_STATUS,
} from './constants';
import {
  Borrowers,
  Loans,
  Lots,
  Offers,
  Organisations,
  PromotionLots,
  PromotionOptions,
  Promotions,
  Properties,
  Tasks,
  Users,
} from '.';
import { LOT_TYPES } from './lots/lotConstants';
import { ROLES } from './users/userConstants';
import MortgageNotes from './mortgageNotes';
import { ORGANISATION_TYPES } from './organisations/organisationConstants';

const TEST_LASTNAME = 'TestLastName';
const TEST_FIRSTNAME = 'TestFirstName';
const TEST_PHONE = '0123456789';

Factory.define('user', Users, {
  roles: [ROLES.USER],
  emails: () => [{ address: faker.internet.email(), verified: false }],
  lastName: TEST_LASTNAME,
  firstName: TEST_FIRSTNAME,
  phoneNumbers: [TEST_PHONE],
});

Factory.define('dev', Users, {
  roles: [ROLES.DEV],
  emails: () => [{ address: faker.internet.email(), verified: false }],
  lastName: TEST_LASTNAME,
  firstName: TEST_FIRSTNAME,
  phoneNumbers: [TEST_PHONE],
});

Factory.define('admin', Users, {
  roles: [ROLES.ADMIN],
  emails: () => [{ address: faker.internet.email(), verified: false }],
  lastName: TEST_LASTNAME,
  firstName: TEST_FIRSTNAME,
  phoneNumbers: [TEST_PHONE],
});

Factory.define('pro', Users, {
  roles: [ROLES.PRO],
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
  name: () => `18-0${Math.floor(Math.random() * 899 + 100)}`,
  emails: () => [],
  propertyIds: [],
});

Factory.define('property', Properties, {
  value: 1000000,
});

Factory.define('offer', Offers, {
  userId: () => faker.random.uuid(),
  createdAt: () => new Date(),
  canton: 'GE',
  conditions: ['Do something'],
  maxAmount: 800000,
  amortizationGoal: 0.65,
});

Factory.define('promotion', Promotions, {
  name: 'Test promotion',
  type: PROMOTION_TYPES.CREDIT,
  userLinks: [{ _id: 'userId', permissions: DOCUMENT_USER_PERMISSIONS.MODIFY }],
  promotionLotLinks: [{ _id: 'lotId' }],
});

Factory.define('promotionOption', PromotionOptions, {
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

Factory.define('task', Tasks, {});

Factory.define('mortgageNote', MortgageNotes, {
  value: 100000,
  canton: 'GE',
});

Factory.define('organisation', Organisations, {
  name: 'UBS SA',
  type: ORGANISATION_TYPES.BANK,
});
