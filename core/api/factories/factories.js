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
import {
  PROPERTY_CATEGORY,
  RESIDENCE_TYPE,
} from '../properties/propertyConstants';
import Notifications from '../notifications/index';
import Activities from '../activities/index';
import { LOAN_CATEGORIES } from '../loans/loanConstants';

const TEST_LASTNAME = 'TestLastName';
const TEST_FIRSTNAME = 'TestFirstName';
const TEST_PHONE = '0123456789';

const getRandomLoanName = () => `19-0${Math.floor(Math.random() * 899 + 100)}`;

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
  createdAt: () => new Date(),
  status: TASK_STATUS.ACTIVE,
});

Factory.define('loan', Loans, {
  createdAt: () => new Date(),
  borrowerIds: [],
  documents: () => ({}),
  step: STEPS.SOLVENCY,
  name: () => {
    // there is a 1/900% chance that 2 loan names collide,
    // make sure it never happens instead
    while (true) {
      const name = getRandomLoanName();

      if (!Loans.findOne({ name })) {
        return name;
      }
    }
  },
  emails: () => [],
  propertyIds: [],
  category: LOAN_CATEGORIES.RETAIL,
  residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
});

Factory.define('property', Properties, {
  value: 1000000,
  category: PROPERTY_CATEGORY.USER,
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
  zipCode: 1201,
});

Factory.define('promotionOption', PromotionOptions, {});
Factory.define('promotionLot', PromotionLots, {});

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
  name: () => {
    // Make sure organisation names don't collide
    while (true) {
      const name = faker.company.companyName();

      if (!Organisations.findOne({ name })) {
        return name;
      }
    }
  },
  type: ORGANISATION_TYPES.BANK,
});

Factory.define('lender', Lenders, {});

Factory.define('interestRates', InterestRates, {});

Factory.define('contact', Contacts, {
  firstName: 'John',
  lastName: 'Doe',
});

Factory.define('lenderRules', LenderRules, {
  filter: { and: [] },
  order: 0,
});

Factory.define('revenues', Revenues, {
  amount: 1000,
  type: REVENUE_TYPES.MORTGAGE,
});

Factory.define('lenderRulesAll', LenderRules, {
  ...DEFAULT_VALUE_FOR_ALL,
  order: 0,
  filter: { and: [true] },
});

Factory.define('lenderRulesMain', LenderRules, {
  maxBorrowRatio: 0.8,
  order: 0,
  filter: { and: DEFAULT_MAIN_RESIDENCE_RULES },
});

Factory.define('lenderRulesSecondary', LenderRules, {
  maxBorrowRatio: 0.7,
  order: 0,
  filter: { and: DEFAULT_SECONDARY_RESIDENCE_RULES },
});

Factory.define('notification', Notifications, {});

Factory.define('activity', Activities, {});
