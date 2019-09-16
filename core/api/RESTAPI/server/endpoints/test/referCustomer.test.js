/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';
import sinon from 'sinon';

import SlackService from 'core/api/slack/server/SlackService';
import UserService from '../../../../users/server/UserService';
import generator from '../../../../factories/index';
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
api.addEndpoint('/users', 'POST', referCustomerAPI);

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

describe('REST: referCustomer', function () {
  this.timeout(10000);

  before(function () {
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
        {
          _factory: 'pro',
          _id: 'pro',
          organisations: [
            {
              _id: 'org',
              $metadata: { isMain: true, title: 'CTO' },
              name: 'Main Org',
            },
            { _id: 'org3' },
          ],
        },
        {
          _factory: 'pro',
          _id: 'pro2',
          emails: [{ address: 'pro2@org.com', verified: true }],
          organisations: [{ _id: 'org', $metadata: { isMain: true } }],
        },
        {
          _factory: 'pro',
          _id: 'pro3',
          emails: [{ address: 'pro3@org2.com', verified: true }],
          organisations: [{ _id: 'org2', $metadata: { isMain: true } }],
        },
        {
          _factory: 'pro',
          _id: 'pro4',
          emails: [{ address: 'pro4@org3.com', verified: true }],
          organisations: [
            { _id: 'org3', $metadata: { isMain: true, title: 'CEO' } },
          ],
        },
      ],
    });
  });

  it('refers a customer', () =>
    referCustomer({
      expectedResponse: {
        message: `Successfully referred user "${customerToRefer.email}"`,
      },
    }).then(() => {
      const customer = UserService.fetchOne({
        $filters: { 'emails.address': { $in: [customerToRefer.email] } },
        referredByUserLink: 1,
        referredByOrganisationLink: 1,
        loans: { shareSolvency: 1 },
      });
      expect(customer.referredByUserLink).to.equal('pro');
      expect(customer.referredByOrganisationLink).to.equal('org');
      expect(customer.loans[0].shareSolvency).to.equal(undefined);
    }));

  it('refers a customer with solvency sharing', () =>
    referCustomer({
      shareSolvency: true,
      expectedResponse: {
        message: `Successfully referred user "${customerToRefer.email}"`,
      },
    }).then(() => {
      const customer = UserService.fetchOne({
        $filters: { 'emails.address': { $in: [customerToRefer.email] } },
        referredByUserLink: 1,
        referredByOrganisationLink: 1,
        loans: { shareSolvency: 1 },
      });
      expect(customer.referredByUserLink).to.equal('pro');
      expect(customer.referredByOrganisationLink).to.equal('org');
      expect(customer.loans[0].shareSolvency).to.equal(true);
    }));

  it('refers a customer with invitationNote', () =>
    referCustomer({
      invitationNote: 'testNote',
      expectedResponse: {
        message: `Successfully referred user "${customerToRefer.email}"`,
      },
    })
      .then(() => {
        const customer = UserService.fetchOne({
          $filters: { 'emails.address': { $in: [customerToRefer.email] } },
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

        return new Promise((resolve, reject) => {
          const interval = Meteor.setInterval(() => {
            if (tasks.length === 0 && intervalCount < 10) {
              tasks = UserService.fetchOne({
                $filters: {
                  'emails.address': { $in: [customerToRefer.email] },
                },
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
      })
      .then((tasks) => {
        expect(tasks.length).to.equal(1);
        expect(tasks[0].description).to.contain('TestFirstName TestLastName');
        expect(tasks[0].description).to.contain('testNote');
      }));

  it('refers a customer with impersonateUser', () =>
    referCustomer({
      impersonateUser: 'pro2@org.com',
      expectedResponse: {
        message: `Successfully referred user "${customerToRefer.email}"`,
      },
    }).then(() => {
      const customer = UserService.getByEmail(customerToRefer.email);
      expect(customer.referredByUserLink).to.equal('pro2');
      expect(customer.referredByOrganisationLink).to.equal('org');
    }));

  it('refers a customer with impersonateUser in another org', () =>
    referCustomer({
      impersonateUser: 'pro4@org3.com',
      expectedResponse: {
        message: `Successfully referred user "${customerToRefer.email}"`,
      },
    }).then(() => {
      const customer = UserService.getByEmail(customerToRefer.email);
      expect(customer.referredByUserLink).to.equal('pro4');
      expect(customer.referredByOrganisationLink).to.equal('org');
    }));

  it('returns an error when impersonateUser is not in the same organisation', () =>
    referCustomer({
      impersonateUser: 'pro3@org2.com',
      expectedResponse: {
        status: 400,
        message:
          '[User with email address "pro3@org2.com" is not part of your organisation]',
      },
    }));

  it('returns an error if the user already exists', () => {
    generator({
      users: { emails: [{ address: customerToRefer.email, verified: false }] },
    });
    return referCustomer({
      expectedResponse: {
        status: 400,
        message:
          "[Ce client existe déjà. Vous ne pouvez pas le référer, mais vous pouvez l'inviter sur un de vos biens immobiliers.]",
      },
    });
  });

  describe('Slack notifications', () => {
    it('sends a properly formatted slack notification', async () => {
      const spy = sinon.spy();
      sinon.stub(SlackService, 'send').callsFake(spy);

      await referCustomer({
        impersonateUser: 'pro4@org3.com',
        expectedResponse: {
          message: `Successfully referred user "${customerToRefer.email}"`,
        },
      });

      expect(spy.calledOnce).to.equal(true);
      expect(spy.args[0][0].username).to.equal('TestFirstName TestLastName (API Main Org)');
      expect(spy.args[0][0].attachments[0].title).to.equal('Test User a été invité sur e-Potek en referral uniquement');

      SlackService.send.restore();
    });
  });
});
