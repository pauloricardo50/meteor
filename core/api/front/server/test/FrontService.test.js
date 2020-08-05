/* eslint-env mocha */

import { Random } from 'meteor/random';

import { expect } from 'chai';
import sinon from 'sinon';

import { resetDatabase } from '../../../../utils/testHelpers';
import NoOpAnalytics from '../../../analytics/server/NoOpAnalytics';
import { DRIP_ACTIONS } from '../../../drip/dripConstants';
import { DripService } from '../../../drip/server/DripService';
import generator from '../../../factories/server';
import LoanService from '../../../loans/server/LoanService';
import UserService from '../../../users/server/UserService';
import { ROLES, USER_STATUS } from '../../../users/userConstants';
import { FrontService, LOANS_TAG_URL } from '../FrontService';

const fetchStub = sinon.stub();
const service = new FrontService({ fetch: fetchStub, isEnabled: true });

describe('FrontService', () => {
  beforeEach(() => {
    resetDatabase();
    fetchStub.reset();
    fetchStub.resolves({ json: () => Promise.resolve({}) });
  });

  describe('getLoanTagId', () => {
    let listTagChildrenStub;
    let createLoanTagStub;

    beforeEach(() => {
      listTagChildrenStub = sinon.stub(service, 'listTagChildren');
      createLoanTagStub = sinon.stub(service, 'createLoanTag');
    });

    afterEach(() => {
      listTagChildrenStub.restore();
      createLoanTagStub.restore();
    });

    it('retrieves the tag id if it exists in Front', async () => {
      listTagChildrenStub.resolves({
        _results: [{ name: 'loan/20-0001', id: 'tagId' }],
      });

      generator({
        users: {
          emails: [{ address: 'user@e-potek.ch', verified: true }],
          roles: [{ _id: ROLES.USER }],
          loans: { _id: 'loanId', name: '20-0001' },
        },
      });

      const id = await service.getLoanTagId({
        loanId: 'loanId',
        loanName: '20-0001',
      });

      expect(id).equal('tagId');
    });

    it('stores an existing tag on the loan', async () => {
      listTagChildrenStub.resolves({
        _results: [{ name: 'loan/20-0001', id: 'tagId' }],
      });

      generator({
        users: {
          emails: [{ address: 'user@e-potek.ch', verified: true }],
          roles: [{ _id: ROLES.USER }],
          loans: { _id: 'loanId', name: '20-0001' },
        },
      });

      await service.getLoanTagId({
        loanId: 'loanId',
        loanName: '20-0001',
      });

      expect(LoanService.get('loanId', { frontTagId: 1 }).frontTagId).to.equal(
        'tagId',
      );
    });

    it('creates a new tag and stores it on the loan if there was none', async () => {
      listTagChildrenStub.resolves({
        _results: [{ name: 'loan/20-0002', id: 'tagId2' }],
      });
      createLoanTagStub.resolves({ id: 'newLoanTag' });

      generator({
        users: {
          emails: [{ address: 'user@e-potek.ch', verified: true }],
          roles: [{ _id: ROLES.USER }],
          loans: { _id: 'loanId', name: '20-0001' },
        },
      });

      await service.getLoanTagId({
        loanId: 'loanId',
        loanName: '20-0001',
      });

      expect(LoanService.get('loanId', { frontTagId: 1 }).frontTagId).to.equal(
        'newLoanTag',
      );
    });
  });

  describe('webhooks', () => {
    it('throws if an invalid webhook is called', () => {
      expect(() =>
        service.handleWebhook({
          body: {},
          webhookName: 'wut',
        }),
      ).to.throw('wut');
    });

    describe('test', () => {
      it('calls the identity API', () => {
        service.handleWebhook({
          body: {},
          webhookName: 'test',
        });

        const [endpoint, { body, method }] = fetchStub.firstCall.args;

        expect(endpoint).to.equal('https://api2.frontapp.com/me');
        expect(method).to.equal('GET');
        expect(body).to.equal(undefined);
      });
    });

    describe('auto tag', () => {
      let listTagChildrenStub;
      let createLoanTagStub;

      beforeEach(() => {
        listTagChildrenStub = sinon.stub(service, 'listTagChildren');
        createLoanTagStub = sinon.stub(service, 'createLoanTag');
      });

      afterEach(() => {
        listTagChildrenStub.restore();
        createLoanTagStub.restore();
      });

      it('tags a conversation if necessary', async () => {
        listTagChildrenStub.resolves({
          _results: [{ name: 'loan/20-0001', id: 'tagId' }],
        });

        generator({
          users: {
            emails: [{ address: 'user@e-potek.ch', verified: true }],
            roles: [{ _id: ROLES.USER }],
            loans: { name: '20-0001' },
          },
        });

        await service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              tags: [{ id: 'tag1' }],
              last_message: {
                recipients: [{ handle: 'user@e-potek.ch', role: 'from' }],
              },
            },
          },
          webhookName: 'auto-tag',
        });

        const [endpoint, { body, method }] = fetchStub.getCall(-1).args;
        const parsedBody = JSON.parse(body);

        expect(endpoint).to.equal(
          'https://api2.frontapp.com/conversations/conversationId',
        );
        expect(method).to.equal('PATCH');
        expect(parsedBody).to.deep.equal({ tag_ids: ['tag1', 'tagId'] });
      });

      it('creates a new tag and stores it on the loan if necessary', async () => {
        listTagChildrenStub.resolves({
          _results: [{ name: 'loan/20-0002', id: 'tagId' }],
        });
        createLoanTagStub.resolves({ id: 'newLoanTag' });

        generator({
          users: {
            emails: [{ address: 'user@e-potek.ch', verified: true }],
            roles: [{ _id: ROLES.USER }],
            loans: { _id: 'loanId', name: '20-0001' },
          },
        });

        await service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              tags: [{ id: 'tag1' }],
              last_message: {
                recipients: [{ handle: 'user@e-potek.ch', role: 'from' }],
              },
            },
          },
          webhookName: 'auto-tag',
        });

        const [endpoint, { body, method }] = fetchStub.getCall(-1).args;
        const parsedBody = JSON.parse(body);

        expect(endpoint).to.equal(
          'https://api2.frontapp.com/conversations/conversationId',
        );
        expect(method).to.equal('PATCH');
        expect(parsedBody).to.deep.equal({ tag_ids: ['tag1', 'newLoanTag'] });

        expect(
          LoanService.get('loanId', { frontTagId: 1 }).frontTagId,
        ).to.equal('newLoanTag');
      });

      it('reuses a tag stored on a loan if it exists', async () => {
        listTagChildrenStub.resolves({
          _results: [{ name: 'loan/20-0002', id: 'tagId' }],
        });
        createLoanTagStub.resolves({ id: 'newLoanTag' });

        generator({
          users: {
            emails: [{ address: 'user@e-potek.ch', verified: true }],
            roles: [{ _id: ROLES.USER }],
            loans: { _id: 'loanId', name: '20-0001', frontTagId: 'existingId' },
          },
        });

        await service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              tags: [{ id: 'tag1' }],
              last_message: {
                recipients: [{ handle: 'user@e-potek.ch', role: 'from' }],
              },
            },
          },
          webhookName: 'auto-tag',
        });

        const [endpoint, { body, method }] = fetchStub.getCall(-1).args;
        const parsedBody = JSON.parse(body);

        expect(endpoint).to.equal(
          'https://api2.frontapp.com/conversations/conversationId',
        );
        expect(method).to.equal('PATCH');
        expect(parsedBody).to.deep.equal({ tag_ids: ['tag1', 'existingId'] });
      });

      it('does not call anything if the user does not exist', () => {
        service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              tags: [{ id: 'tag1' }],
              last_message: {
                recipients: [{ handle: 'user@e-potek.ch', role: 'from' }],
              },
            },
          },
          webhookName: 'auto-tag',
        });

        expect(fetchStub.callCount).to.equal(0);
      });

      it('does not call anything if the user has multiple loans', () => {
        generator({
          users: {
            emails: [{ address: 'user@e-potek.ch', verified: true }],
            roles: [{ _id: ROLES.USER }],
            loans: [{}, {}],
          },
        });

        service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              tags: [{ id: 'tag1' }],
              last_message: {
                recipients: [{ handle: 'user@e-potek.ch', role: 'from' }],
              },
            },
          },
          webhookName: 'auto-tag',
        });

        expect(fetchStub.callCount).to.equal(0);
      });

      it('does not call anything if the user has no loans', () => {
        generator({
          users: {
            emails: [{ address: 'user@e-potek.ch', verified: true }],
            roles: [{ _id: ROLES.USER }],
          },
        });

        service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              tags: [{ id: 'tag1' }],
              last_message: {
                recipients: [{ handle: 'user@e-potek.ch', role: 'from' }],
              },
            },
          },
          webhookName: 'auto-tag',
        });

        expect(fetchStub.callCount).to.equal(0);
      });

      it('does not call anything if there is already a loan tag', () => {
        service.handleWebhook({
          body: {
            conversation: {
              tags: [
                { id: 'tag1' },
                {
                  id: 'tag2',
                  _links: { related: { parent_tag: LOANS_TAG_URL } },
                },
              ],
              last_message: {
                recipients: [],
              },
            },
          },
          webhookName: 'auto-tag',
        });

        expect(fetchStub.callCount).to.equal(0);
      });
    });

    describe('auto assign', () => {
      let listTeamStub;

      beforeEach(() => {
        listTeamStub = sinon.stub(service, 'listTeam');
      });

      afterEach(() => {
        listTeamStub.restore();
      });

      it('assigns a conversation to the user assignee', async () => {
        listTeamStub.resolves({
          _results: [{ id: 'admin', email: 'admin@e-potek.ch' }],
        });

        generator({
          users: {
            emails: [{ address: 'user@e-potek.ch', verified: true }],
            roles: [{ _id: ROLES.USER }],
            assignedEmployee: {
              emails: [{ address: 'admin@e-potek.ch', verified: true }],
            },
          },
        });

        await service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              last_message: {
                recipients: [{ handle: 'user@e-potek.ch', role: 'from' }],
              },
            },
          },
          webhookName: 'auto-assign',
        });

        const [endpoint, { body, method }] = fetchStub.getCall(-1).args;
        const parsedBody = JSON.parse(body);

        expect(endpoint).to.equal(
          'https://api2.frontapp.com/conversations/conversationId/assignee',
        );
        expect(method).to.equal('PUT');
        expect(parsedBody).to.deep.equal({ assignee_id: 'admin' });
      });

      it('sets the front user id on the assignee', async () => {
        listTeamStub.resolves({
          _results: [{ id: 'admin', email: 'admin@e-potek.ch' }],
        });

        generator({
          users: {
            emails: [{ address: 'user@e-potek.ch', verified: true }],
            roles: [{ _id: ROLES.USER }],
            assignedEmployee: {
              emails: [{ address: 'admin@e-potek.ch', verified: true }],
            },
          },
        });

        await service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              last_message: {
                recipients: [{ handle: 'user@e-potek.ch', role: 'from' }],
              },
            },
          },
          webhookName: 'auto-assign',
        });

        const { frontUserId } = UserService.getByEmail('admin@e-potek.ch', {
          frontUserId: 1,
        });
        expect(frontUserId).to.equal('admin');
      });

      it('assigns a conversation to the user only loan main assignee', async () => {
        listTeamStub.resolves({
          _results: [
            { id: 'admin1', email: 'admin1@e-potek.ch' },
            { id: 'admin2', email: 'admin2@e-potek.ch' },
            { id: 'admin3', email: 'admin3@e-potek.ch' },
          ],
        });

        generator({
          users: {
            emails: [{ address: 'user@e-potek.ch', verified: true }],
            roles: [{ _id: ROLES.USER }],
            loans: {
              assignees: [
                {
                  emails: [{ address: 'admin2@e-potek.ch', verified: true }],
                  $metadata: { isMain: true },
                },
                { emails: [{ address: 'admin3@e-potek.ch', verified: true }] },
              ],
            },
            assignedEmployee: {
              emails: [{ address: 'admin1@e-potek.ch', verified: true }],
            },
          },
        });

        await service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              last_message: {
                recipients: [{ handle: 'user@e-potek.ch', role: 'from' }],
              },
            },
          },
          webhookName: 'auto-assign',
        });

        const [endpoint, { body, method }] = fetchStub.getCall(-1).args;
        const parsedBody = JSON.parse(body);

        expect(endpoint).to.equal(
          'https://api2.frontapp.com/conversations/conversationId/assignee',
        );
        expect(method).to.equal('PUT');
        expect(parsedBody).to.deep.equal({ assignee_id: 'admin2' });
      });

      it('assigns a conversation to the user assignee if it has 2 loans', async () => {
        listTeamStub.resolves({
          _results: [
            { id: 'admin1', email: 'admin1@e-potek.ch' },
            { id: 'admin2', email: 'admin2@e-potek.ch' },
            { id: 'admin3', email: 'admin3@e-potek.ch' },
          ],
        });

        generator({
          users: {
            emails: [{ address: 'user@e-potek.ch', verified: true }],
            roles: [{ _id: ROLES.USER }],
            loans: [
              {
                assignees: [
                  {
                    emails: [{ address: 'admin2@e-potek.ch', verified: true }],
                    $metadata: { isMain: true },
                  },
                ],
              },
              {
                assignees: [
                  {
                    emails: [{ address: 'admin3@e-potek.ch', verified: true }],
                    $metadata: { isMain: true },
                  },
                ],
              },
            ],
            assignedEmployee: {
              emails: [{ address: 'admin1@e-potek.ch', verified: true }],
            },
          },
        });

        await service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              last_message: {
                recipients: [{ handle: 'user@e-potek.ch', role: 'from' }],
              },
            },
          },
          webhookName: 'auto-assign',
        });

        const [endpoint, { body, method }] = fetchStub.getCall(-1).args;
        const parsedBody = JSON.parse(body);

        expect(endpoint).to.equal(
          'https://api2.frontapp.com/conversations/conversationId/assignee',
        );
        expect(method).to.equal('PUT');
        expect(parsedBody).to.deep.equal({ assignee_id: 'admin1' });
      });

      it('does not call anything if the conversation is already assigned', () => {
        service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              recipient: { handle: 'user@e-potek.ch', role: 'from' },
              assignee: { id: 'someAssignee' },
            },
          },
          webhookName: 'auto-assign',
        });

        expect(fetchStub.callCount).to.equal(0);
      });

      it('does not call anything if the user does not exist', () => {
        service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              recipient: { handle: 'user@e-potek.ch', role: 'from' },
            },
          },
          webhookName: 'auto-assign',
        });

        expect(fetchStub.callCount).to.equal(0);
      });

      it('does not call anything if the user has no assignee', () => {
        generator({
          users: {
            emails: [{ address: 'user@e-potek.ch', verified: true }],
            roles: [{ _id: ROLES.USER }],
          },
        });

        service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              recipient: { handle: 'user@e-potek.ch', role: 'from' },
            },
          },
          webhookName: 'auto-assign',
        });

        expect(fetchStub.callCount).to.equal(0);
      });

      it('does not call anything if the user has no assignee and no loan assignee', () => {
        generator({
          users: {
            emails: [{ address: 'user@e-potek.ch', verified: true }],
            roles: [{ _id: ROLES.USER }],
            loans: [{ _id: 'loan' }],
          },
        });

        service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              recipient: { handle: 'user@e-potek.ch', role: 'from' },
            },
          },
          webhookName: 'auto-assign',
        });

        expect(fetchStub.callCount).to.equal(0);
      });

      it('does not call anything if the assignee is not found in the team mates', async () => {
        listTeamStub.resolves({
          _results: [{ id: 'admin', email: 'admin@e-potek.ch' }],
        });

        generator({
          users: {
            emails: [{ address: 'user@e-potek.ch', verified: true }],
            roles: [{ _id: ROLES.USER }],
            assignedEmployee: {
              emails: [{ address: 'admin2@e-potek.ch', verified: true }],
            },
          },
        });

        await service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              last_message: {
                recipients: [{ handle: 'user@e-potek.ch', role: 'from' }],
              },
            },
          },
          webhookName: 'auto-assign',
        });

        expect(fetchStub.callCount).to.equal(0);
      });

      it('does not call front list team if the assignee has already a front user id stored in db', async () => {
        generator({
          users: {
            emails: [{ address: 'user@e-potek.ch', verified: true }],
            roles: [{ _id: ROLES.USER }],
            assignedEmployee: {
              emails: [{ address: 'admin@e-potek.ch', verified: true }],
              frontUserId: 'admin',
            },
          },
        });

        await service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              last_message: {
                recipients: [{ handle: 'user@e-potek.ch', role: 'from' }],
              },
            },
          },
          webhookName: 'auto-assign',
        });

        expect(listTeamStub.callCount).to.equal(0);

        const [endpoint, { body, method }] = fetchStub.getCall(-1).args;
        const parsedBody = JSON.parse(body);

        expect(endpoint).to.equal(
          'https://api2.frontapp.com/conversations/conversationId/assignee',
        );
        expect(method).to.equal('PUT');
        expect(parsedBody).to.deep.equal({ assignee_id: 'admin' });
      });
    });

    describe('drip qualify', () => {
      let analyticsSpy;
      let callDripAPIStub;
      const email = `subscriber-${Random.id()}@e-potek.ch`;
      const userId = Random.id();

      beforeEach(() => {
        analyticsSpy = sinon.spy(NoOpAnalytics.prototype, 'track');
        callDripAPIStub = sinon.stub(DripService.prototype, 'callDripAPI');
        callDripAPIStub.resolves({});
      });

      afterEach(() => {
        analyticsSpy.restore();
        callDripAPIStub.restore();
      });

      it('does nothing if user is not found in our DB', async () => {
        await service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              last_message: {
                recipients: [{ handle: email, role: 'from' }],
              },
            },
          },
          webhookName: 'drip-qualify',
        });

        expect(callDripAPIStub.called).to.equal(false);
      });

      it('does nothing if user is not USER', async () => {
        generator({
          users: {
            _id: userId,
            _factory: 'pro',
            emails: [{ address: email, verified: true }],
          },
        });
        await service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              last_message: {
                recipients: [{ handle: email, role: 'from' }],
              },
            },
          },
          webhookName: 'drip-qualify',
        });

        expect(callDripAPIStub.called).to.equal(false);
      });

      it('does nothing if user is already QUALIFIED', async () => {
        generator({
          users: {
            _id: userId,
            status: USER_STATUS.QUALIFIED,
            emails: [{ address: email, verified: true }],
          },
        });
        await service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              last_message: {
                recipients: [{ handle: email, role: 'from' }],
              },
            },
          },
          webhookName: 'drip-qualify',
        });

        expect(callDripAPIStub.called).to.equal(false);
      });

      it('sets the user status to QUALIFIED', async () => {
        generator({
          users: {
            _id: userId,
            emails: [{ address: email, verified: true }],
          },
        });
        await service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              last_message: {
                recipients: [{ handle: email, role: 'from' }],
              },
            },
          },
          webhookName: 'drip-qualify',
        });

        const { status } = UserService.get(userId, { status: 1 });

        expect(status).to.equal(USER_STATUS.QUALIFIED);
      });

      it('records the event', async () => {
        generator({
          users: {
            _id: userId,
            emails: [{ address: email, verified: true }],
          },
        });
        await service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              last_message: {
                recipients: [{ handle: email, role: 'from' }],
              },
            },
          },
          webhookName: 'drip-qualify',
        });

        const [[method, params]] = callDripAPIStub.args;

        expect(method).to.equal('recordEvent');
        expect(params).to.deep.include({
          action: DRIP_ACTIONS.USER_QUALIFIED,
          email,
          properties: undefined,
        });
      });

      it('tracks the event in analytics', async () => {
        generator({
          users: {
            _id: userId,
            emails: [{ address: email, verified: true }],
          },
        });
        await service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              last_message: {
                recipients: [{ handle: email, role: 'from' }],
              },
            },
          },
          webhookName: 'drip-qualify',
        });

        expect(analyticsSpy.args[0][0]).to.deep.include({
          userId,
          event: 'User Changed Status',
        });
        expect(analyticsSpy.args[1][0]).to.deep.include({
          userId,
          event: 'Drip Subscriber Event Recorded',
        });
      });
    });
  });
});
