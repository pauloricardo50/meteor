import { Roles } from 'meteor/alanning:roles';
import { Factory } from 'meteor/dburles:factory';
import { Random } from 'meteor/random';

import faker from 'faker';
import moment from 'moment';

import Activities from '../activities';
import Borrowers from '../borrowers/borrowers';
import CommissionRates from '../commissionRates';
import { COMMISSION_RATES_TYPE } from '../commissionRates/commissionRateConstants';
import Contacts from '../contacts';
import InsuranceProducts from '../insuranceProducts';
import {
  INSURANCE_PRODUCT_CATEGORIES,
  INSURANCE_PRODUCT_FEATURES,
} from '../insuranceProducts/insuranceProductConstants';
import InsuranceRequests from '../insuranceRequests';
import Insurances from '../insurances';
import InterestRates from '../interestRates';
import LenderRules from '../lenderRules';
import {
  DEFAULT_MAIN_RESIDENCE_RULES,
  DEFAULT_SECONDARY_RESIDENCE_RULES,
  DEFAULT_VALUE_FOR_ALL,
} from '../lenderRules/lenderRulesConstants';
import Lenders from '../lenders';
import { LOAN_CATEGORIES, STEPS } from '../loans/loanConstants';
import Loans from '../loans/loans';
import { LOT_TYPES } from '../lots/lotConstants';
import Lots from '../lots/lots';
import MortgageNotes from '../mortgageNotes';
import Notifications from '../notifications';
import Offers from '../offers';
import Organisations from '../organisations';
import { ORGANISATION_TYPES } from '../organisations/organisationConstants';
import PromotionLots from '../promotionLots';
import PromotionOptions from '../promotionOptions';
import Promotions from '../promotions';
import { PROMOTION_TYPES } from '../promotions/promotionConstants';
import Properties from '../properties/properties';
import {
  PROPERTY_CATEGORY,
  RESIDENCE_TYPE,
} from '../properties/propertyConstants';
import Revenues from '../revenues';
import { REVENUE_TYPES } from '../revenues/revenueConstants';
import { TASK_STATUS } from '../tasks/taskConstants';
import Tasks from '../tasks/tasks';
import { ROLES } from '../users/userConstants';
import Users from '../users/users';

const TEST_PHONE = '0123456789';

const getRandomLoanName = () => `20-0${Math.floor(Math.random() * 899 + 100)}`;
const getRandomInsuranceRequestName = () =>
  `20-0${Math.floor(Math.random() * 899 + 100)}-A`;
const getRandomInsuranceName = () =>
  `20-0${Math.floor(Math.random() * 899 + 100)}-A01`;

Object.values(ROLES).forEach(role => {
  Factory.define(role, Users, {
    emails: () => [{ address: faker.internet.email(), verified: false }],
    lastName: () => faker.name.lastName(),
    firstName: () => faker.name.firstName(),
    phoneNumbers: [TEST_PHONE],
  }).after(({ _id }) => {
    Roles.setUserRoles(_id, role);
  });
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
      emails: [{ address: `info${Random.id()}@e-potek.ch`, verified: true }],
      lastName: faker.name.lastName(),
      firstName: faker.name.firstName(),
      phoneNumbers: [TEST_PHONE],
    });
    Roles.setUserRoles(adminId, ROLES.ADMIN);

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
  maxProductionYears: 35,
});
