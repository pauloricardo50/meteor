import { Factory } from 'meteor/dburles:factory';
import { Random } from 'meteor/random';

import faker from 'faker';

import moment from 'moment';

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
  INSURANCE_PRODUCT_FEATURES,
  INSURANCE_PRODUCT_CATEGORIES,
  PROPERTY_CATEGORY,
  RESIDENCE_TYPE,
  LOAN_CATEGORIES,
  COMMISSION_RATES_TYPE,
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
  InsuranceRequests,
  Insurances,
  CommissionRates,
  InsuranceProducts,
  Notifications,
  Activities,
} from '..';

const TEST_LASTNAME = 'TestLastName';
const TEST_FIRSTNAME = 'TestFirstName';
const TEST_PHONE = '0123456789';

const getRandomLoanName = () => `20-0${Math.floor(Math.random() * 899 + 100)}`;
const getRandomInsuranceRequestName = () =>
  `20-0${Math.floor(Math.random() * 899 + 100)}-A`;
const getRandomInsuranceName = () =>
  `20-0${Math.floor(Math.random() * 899 + 100)}-A01`;

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
  agreementDuration: 14,
  city: 'Genève',
  assignedEmployeeId: () => {
    const adminId = Users.insert({
      roles: [ROLES.ADMIN],
      emails: [{ address: `info${Random.id()}@e-potek.ch`, verified: true }],
      lastName: TEST_LASTNAME,
      firstName: TEST_FIRSTNAME,
      phoneNumbers: [TEST_PHONE],
    });

    return adminId;
  },
});

Factory.define('promotionOption', PromotionOptions, {});
Factory.define('promotionLot', PromotionLots, {
  propertyLinks: () => {
    const propertyId = Properties.insert({
      address1: 'Rue du parc 1',
      value: 1000000,
      name: 'Lot A',
    });
    return [{ _id: propertyId }];
  },
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
  expectedAt: () => new Date(),
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

Factory.define('insuranceRequest', InsuranceRequests, {
  createdAt: () => new Date(),
  name: () => {
    while (true) {
      const name = getRandomInsuranceRequestName();

      if (!InsuranceRequests.findOne({ name })) {
        return name;
      }
    }
  },
});

Factory.define('insurance', Insurances, {
  createdAt: () => new Date(),
  startDate: () => new Date('2020-02-01T00:00:00'),
  endDate: () => new Date('2045-02-01T00:00:00'),
  name: () => {
    while (true) {
      const name = getRandomInsuranceName();

      if (!Insurances.findOne({ name })) {
        return name;
      }
    }
  },
  startDate: () => new Date(),
  endDate: () =>
    moment()
      .add(10, 'years')
      .toDate(),
});

Factory.define('commissionRate', CommissionRates, {
  createdAt: () => new Date(),
  type: COMMISSION_RATES_TYPE.PRODUCTIONS,
  rates: [{ rate: 0.01, threshold: 0, startDate: '01-01' }],
});

Factory.define('insuranceProduct', InsuranceProducts, {
  createdAt: () => new Date(),
  name: 'Product',
  features: [INSURANCE_PRODUCT_FEATURES.CAPITALIZATION],
  category: INSURANCE_PRODUCT_CATEGORIES['3A_INSURANCE'],
  revaluationFactor: 2,
});
