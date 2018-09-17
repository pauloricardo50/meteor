import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';

import { TASK_STATUS, TASK_TYPE } from './tasks/taskConstants';
import Loans from './loans';
import Borrowers from './borrowers';
import Properties from './properties';
import Offers from './offers';
import Tasks from './tasks';
import Users from './users';

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
  status: 'ACTIVE',
  documents: () => ({}),
  logic: () => ({
    auction: { status: '' },
    verification: {},
    step: 1,
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
