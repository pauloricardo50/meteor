/* eslint-env mocha */
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { expect } from 'chai';
import sinon from 'sinon';

import generator from '../../../factories/server';
import { LOANS_TAG_URL, FrontService } from '../FrontService';
import { ROLES } from '../../../users/userConstants';
import LoanService from '../../../loans/server/LoanService';

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
          roles: [ROLES.USER],
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
          roles: [ROLES.USER],
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
          roles: [ROLES.USER],
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
            roles: [ROLES.USER],
            loans: { name: '20-0001' },
          },
        });

        await service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              tags: [{ id: 'tag1' }],
              recipient: { handle: 'user@e-potek.ch', role: 'from' },
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
            roles: [ROLES.USER],
            loans: { _id: 'loanId', name: '20-0001' },
          },
        });

        await service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              tags: [{ id: 'tag1' }],
              recipient: { handle: 'user@e-potek.ch', role: 'from' },
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
            roles: [ROLES.USER],
            loans: { _id: 'loanId', name: '20-0001', frontTagId: 'existingId' },
          },
        });

        await service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              tags: [{ id: 'tag1' }],
              recipient: { handle: 'user@e-potek.ch', role: 'from' },
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
              recipient: { handle: 'user@e-potek.ch', role: 'from' },
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
            roles: [ROLES.USER],
            loans: [{}, {}],
          },
        });

        service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              tags: [{ id: 'tag1' }],
              recipient: { handle: 'user@e-potek.ch', role: 'from' },
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
            roles: [ROLES.USER],
          },
        });

        service.handleWebhook({
          body: {
            conversation: {
              id: 'conversationId',
              tags: [{ id: 'tag1' }],
              recipient: { handle: 'user@e-potek.ch', role: 'from' },
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
              recipient: {},
            },
          },
          webhookName: 'auto-tag',
        });

        expect(fetchStub.callCount).to.equal(0);
      });
    });
  });
});
