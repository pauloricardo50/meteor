import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';
import Loans from './loans';
import Borrowers from './borrowers';
import Properties from './properties';
import Offers from './offers';
import Tasks from './tasks';
import Users from './users';
import { TASK_STATUS, TASK_TYPE } from '../api/tasks/taskConstants';
import { fakeFile } from '../api/files/fakes';

const TEST_LASTNAME = 'TestLastName';
const TEST_FIRSTNAME = 'TestFirstName';
const TEST_PHONE = '0123456789';

Factory.define('user', Users, {
  roles: () => 'user',
  emails: () => [{ address: faker.internet.email(), verified: false }],
  lastName: TEST_LASTNAME,
  firstName: TEST_FIRSTNAME,
  phone: TEST_PHONE,
});

Factory.define('dev', Users, {
  roles: () => 'dev',
  emails: () => [{ address: faker.internet.email(), verified: false }],
  lastName: TEST_LASTNAME,
  firstName: TEST_FIRSTNAME,
  phone: TEST_PHONE,
});

Factory.define('admin', Users, {
  roles: () => 'admin',
  emails: () => [{ address: faker.internet.email(), verified: false }],
  lastName: TEST_LASTNAME,
  firstName: TEST_FIRSTNAME,
  phone: TEST_PHONE,
});

Factory.define('borrower', Borrowers, {});

Factory.define('task', Tasks, {
  type: TASK_TYPE.USER_ADDED_FILE,
  createdAt: () => new Date(),
  status: TASK_STATUS.ACTIVE,
  documentId: 'aDocumentId',
  fileKey: fakeFile.key,
});

Factory.define('loan', Loans, {
  createdAt: () => new Date(),
  general: () => ({
    fortuneUsed: 250000,
    insuranceFortuneUsed: 0,
    partnersToAvoid: ['joe', 'john'],
  }),
  borrowerIds: [],
  status: 'ACTIVE',
  documents: () => ({}),
  logic: () => ({
    auction: {},
    lender: {},
    verification: {},
    step: 1,
  }),
  name: () => 'loan name',
  emails: () => [],
});

Factory.define('property', Properties, {
  value: 1000000,
  documents: () => ({}),
  expertise: () => ({}),
});

Factory.define('offer', Offers, {
  userId: () => faker.random.uuid(),
  createdAt: () => new Date(),
  organization: 'bankName',
  canton: 'GE',
  conditions: 'Do something',
  counterparts: 'Do something more',
  standardOffer: () => ({
    maxAmount: 800000,
    amortization: 0.01,
    interestLibor: 0.01,
    interest1: 0.01,
    interest2: 0.01,
    interest5: 0.01,
    interest10: 0.01,
  }),
  counterpartOffer: () => ({
    maxAmount: 800000,
    amortization: 0.008,
    interestLibor: 0.008,
    interest1: 0.008,
    interest2: 0.008,
    interest5: 0.008,
    interest10: 0.008,
  }),
});
