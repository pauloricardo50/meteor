import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';

import {
  LOT_TYPES,
  ORGANISATION_TYPES,
  PROMOTION_TYPES,
  REVENUE_TYPES,
  ROLES,
  STEPS,
  TASK_STATUS,
  TASK_TYPE,
  DEFAULT_VALUE_FOR_ALL,
  DEFAULT_MAIN_RESIDENCE_RULES,
  DEFAULT_SECONDARY_RESIDENCE_RULES,
} from '../constants';
import {
  Borrowers,
  Contacts,
  InterestRates,
  LenderRules,
  Lenders,
  Loans,
  Lots,
  MortgageNotes,
  Offers,
  Organisations,
  PromotionLots,
  PromotionOptions,
  Promotions,
  Properties,
  Revenues,
  Tasks,
  Users,
} from '..';

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

Factory.define('adminEpotek', Users, {
  roles: [ROLES.ADMIN],
  emails: () => [{ address: 'dev@e-potek.ch', verified: true }],
  lastName: 'e-Potek',
  firstName: 'Dev',
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
  name: () => `19-0${Math.floor(Math.random() * 899 + 100)}`,
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

Factory.define('lender', Lenders, {});

Factory.define('interestRates', InterestRates, {});

Factory.define('contact', Contacts, {
  firstName: 'John',
  lastName: 'Doe',
});

Factory.define('lenderRules', LenderRules, {
  filter: {},
  order: 0,
});

Factory.define('revenues', Revenues, {
  amount: 1000,
  type: REVENUE_TYPES.MORTGAGE,
});

Factory.define('lenderRulesAll', LenderRules, {
  ...DEFAULT_VALUE_FOR_ALL,
  filter: { and: [true] },
});

Factory.define('lenderRulesMain', LenderRules, {
  maxBorrowRatio: 0.8,
  filter: { and: DEFAULT_MAIN_RESIDENCE_RULES },
});

Factory.define('lenderRulesSecondary', LenderRules, {
  maxBorrowRatio: 0.7,
  filter: { and: DEFAULT_SECONDARY_RESIDENCE_RULES },
});
