/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';
import sinon from 'sinon';

import { checkEmails } from '../../../../../utils/testHelpers';
import SlackService from '../../../../slack/server/SlackService';
import UserService from '../../../../users/server/UserService';
import generator from '../../../../factories/server';
import RESTAPI from '../../RESTAPI';
import referCustomerAPI from '../referCustomer';
import {
  fetchAndCheckResponse,
  makeHeaders,
  getTimestampAndNonce,
} from '../../test/apiTestHelpers.test';

const customerToRefer = {
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  phoneNumber: '1234',
};

const api = new RESTAPI();
api.addEndpoint('/users', 'POST', referCustomerAPI, {
  rsaAuth: true,
  endpointName: 'Refer customer',
});

const referCustomer = ({
  userData,
  impersonateUser,
  expectedResponse,
  shareSolvency,
  invitationNote,
}) => {
  const { timestamp, nonce } = getTimestampAndNonce();

  const body = {
    user: userData || customerToRefer,
    shareSolvency,
    invitationNote,
  };
  const query = impersonateUser
    ? { 'impersonate-user': impersonateUser }
    : undefined;
  return fetchAndCheckResponse({
    url: '/users',
    query,
    data: {
      method: 'POST',
      headers: makeHeaders({
        userId: 'pro',
        timestamp,
        nonce,
        body,
        query,
      }),
      body: JSON.stringify(body),
    },
    expectedResponse,
  });
};

describe('REST: referCustomer', function() {
  this.timeout(10000);

  before(function() {
    if (Meteor.settings.public.microservice !== 'pro') {
      this.parent.pending = true;
      this.skip();
    } else {
      api.start();
    }
  });

  after(() => {
    api.reset();
  });

  beforeEach(() => {
    resetDatabase();
    generator({
      users: [
        { _id: 'admin', _factory: 'admin' },
        {
          _factory: 'pro',
          _id: 'pro',
          organisations: [
            {
              _id: 'org',
              $metadata: { isMain: true, title: 'CTO' },
              name: 'Org 1',
            },
            { _id: 'org3', name: 'Org 3' },
          ],
          assignedEmployeeId: 'admin',
        },
        {
          _factory: 'pro',
          _id: 'pro2',
          emails: [{ address: 'pro2@org.com', verified: true }],
          organisations: [{ _id: 'org', $metadata: { isMain: true } }],
          assignedEmployeeId: 'admin',
        },
        {
          _factory: 'pro',
          _id: 'pro3',
          emails: [{ address: 'pro3@org2.com', verified: true }],
          organisations: [
            { _id: 'org2', $metadata: { isMain: true }, name: 'Org 2' },
          ],
          assignedEmployeeId: 'admin',
        },
        {
          _factory: 'pro',
          _id: 'pro4',
          emails: [{ address: 'pro4@org3.com', verified: true }],
          organisations: [
            { _id: 'org3', $metadata: { isMain: true, title: 'CEO' } },
          ],
          assignedEmployeeId: 'admin',
        },
      ],
    });
  });

  it('refers a customer', async () => {
    await referCustomer({
      expectedResponse: {
        message: `Successfully referred user "${customerToRefer.email}"`,
      },
    });

    const customer = UserService.getByEmail(customerToRefer.email, {
      referredByUserLink: 1,
      referredByOrganisationLink: 1,
      loans: { shareSolvency: 1 },
    });
    expect(customer.referredByUserLink).to.equal('pro');
    expect(customer.referredByOrganisationLink).to.equal('org');
    expect(customer.loans[0].shareSolvency).to.equal(undefined);

    await checkEmails(2);
  });

  it('refers a customer with solvency sharing', async () => {
    await referCustomer({
      shareSolvency: true,
      expectedResponse: {
        message: `Successfully referred user "${customerToRefer.email}"`,
      },
    });

    const customer = UserService.getByEmail(customerToRefer.email, {
      referredByUserLink: 1,
      referredByOrganisationLink: 1,
      loans: { shareSolvency: 1 },
    });
    expect(customer.referredByUserLink).to.equal('pro');
    expect(customer.referredByOrganisationLink).to.equal('org');
    expect(customer.loans[0].shareSolvency).to.equal(true);

    await checkEmails(2);
  });

  it('refers a customer with invitationNote', async () => {
    await referCustomer({
      invitationNote: 'testNote',
      expectedResponse: {
        message: `Successfully referred user "${customerToRefer.email}"`,
      },
    });

    const customer = UserService.getByEmail(customerToRefer.email, {
      referredByUserLink: 1,
      referredByOrganisationLink: 1,
      loans: { shareSolvency: 1 },
      tasks: { description: 1 },
    });
    expect(customer.referredByUserLink).to.equal('pro');
    expect(customer.referredByOrganisationLink).to.equal('org');
    expect(customer.loans[0].shareSolvency).to.equal(undefined);

    let { tasks = [] } = customer;
    let intervalCount = 0;

    tasks = await new Promise((resolve, reject) => {
      const interval = Meteor.setInterval(() => {
        if (tasks.length === 0 && intervalCount < 10) {
          tasks =
            UserService.getByEmail(customerToRefer.email, {
              tasks: { description: 1 },
            }).tasks || [];
          intervalCount++;
        } else {
          Meteor.clearInterval(interval);
          if (intervalCount >= 10) {
            reject('Fetch tasks timeout');
          }
          resolve(tasks);
        }
      }, 100);
    });

    expect(tasks.length).to.equal(1);
    expect(tasks[0].description).to.contain('TestFirstName TestLastName');
    expect(tasks[0].description).to.contain('testNote');

    await checkEmails(2);
  });

  it('refers a customer with impersonateUser', async () => {
    await referCustomer({
      impersonateUser: 'pro2@org.com',
      expectedResponse: {
        message: `Successfully referred user "${customerToRefer.email}"`,
      },
    });

    const customer = UserService.getByEmail(customerToRefer.email, {
      referredByOrganisationLink: 1,
      referredByUserLink: 1,
    });
    expect(customer.referredByUserLink).to.equal('pro2');
    expect(customer.referredByOrganisationLink).to.equal('org');

    await checkEmails(2);
  });

  it('refers a customer with impersonateUser in another org', async () => {
    await referCustomer({
      impersonateUser: 'pro4@org3.com',
      expectedResponse: {
        message: `Successfully referred user "${customerToRefer.email}"`,
      },
    });

    const customer = UserService.getByEmail(customerToRefer.email, {
      referredByOrganisationLink: 1,
      referredByUserLink: 1,
    });
    expect(customer.referredByUserLink).to.equal('pro4');
    expect(customer.referredByOrganisationLink).to.equal('org');

    await checkEmails(2);
  });

  it('returns an error when impersonateUser is not in the same organisation', async () => {
    await referCustomer({
      impersonateUser: 'pro3@org2.com',
      expectedResponse: {
        status: 400,
        message:
          '[User with email address "pro3@org2.com" is not part of your organisation]',
      },
    });
  });

  it('returns an error if the user already exists', async () => {
    generator({
      users: { emails: [{ address: customerToRefer.email, verified: false }] },
    });

    await referCustomer({
      expectedResponse: {
        status: 400,
        message:
          "[Ce client existe déjà. Vous ne pouvez pas le référer, mais vous pouvez l'inviter sur un de vos biens immobiliers.]",
      },
    });
  });

  describe('Slack notifications', () => {
    afterEach(() => {
      SlackService.send.restore();
    });

    it('sends a properly formatted slack notification', async () => {
      const spy = sinon.spy();
      sinon.stub(SlackService, 'send').callsFake(spy);

      await referCustomer({
        impersonateUser: 'pro4@org3.com',
        expectedResponse: {
          message: `Successfully referred user "${customerToRefer.email}"`,
        },
      });

      expect(spy.called).to.equal(true);
      expect(spy.lastCall.args[0].username).to.equal(
        'TestFirstName TestLastName (Org 3, API Org 1)',
      );
      expect(spy.lastCall.args[0].attachments[0].title).to.equal(
        'Test User a été invité sur e-Potek en referral uniquement',
      );

      await checkEmails(2);
    });
  });
});
