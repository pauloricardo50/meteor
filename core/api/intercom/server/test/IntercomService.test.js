import { expect } from 'chai';
import crypto from 'crypto';
import sinon from 'sinon';

import { resetDatabase } from '../../../../utils/testHelpers';
import EVENTS from '../../../analytics/events';
import NoOpAnalytics from '../../../analytics/server/NoOpAnalytics';
import generator from '../../../factories/server';
import { SessionService } from '../../../sessions/server/SessionService';
import UserService from '../../../users/server/UserService';
import {
  CLIENT_SECRET,
  IntercomService as IntercomServiceClass,
} from '../IntercomService';

const fetchStub = sinon.stub();
const IntercomService = new IntercomServiceClass({
  fetch: fetchStub,
  isEnabled: true,
});

describe.only('IntercomService', () => {
  beforeEach(() => {
    resetDatabase();
    fetchStub.reset();
    fetchStub.resolves({ json: () => Promise.resolve({}) });
  });

  describe('getIntercomSettings', () => {
    let updateContactOwnerStub;

    beforeEach(() => {
      updateContactOwnerStub = sinon.stub(
        IntercomService,
        'updateContactOwner',
      );
    });

    afterEach(() => {
      updateContactOwnerStub.restore();
    });

    it('returns intercom settings for logged in user', () => {
      generator({
        users: {
          _id: 'user',
          firstName: 'Bob',
          lastName: 'Dylan',
          emails: [{ address: 'user@e-potek.ch', verified: true }],
          phoneNumbers: ['123456'],
          intercomId: '12345',
        },
      });

      const settings = IntercomService.getIntercomSettings({ userId: 'user' });
      expect(settings).to.deep.include({
        email: 'user@e-potek.ch',
        name: 'Bob Dylan',
        phone: '+41 123456',
      });
      expect(settings.user_hash).to.not.equal(undefined);
    });

    it('returns only app_id for logged out user', () => {
      const settings = IntercomService.getIntercomSettings({});
      expect(settings.app_id).to.not.equal(undefined);
      expect(settings.user_hash).to.equal(undefined);
    });

    it('calls updateContactOwner if required', () => {
      generator({
        users: [
          { _id: 'admin', _factory: 'admin' },
          {
            _id: 'user',
            firstName: 'Bob',
            lastName: 'Dylan',
            emails: [{ address: 'user@e-potek.ch', verified: true }],
            phoneNumbers: ['123456'],
            assignedEmployeeId: 'admin',
          },
        ],
      });

      IntercomService.getIntercomSettings({ userId: 'user' });

      expect(updateContactOwnerStub.called).to.equal(true);
    });

    it('does not call updateContactOwner if user has an intercomId', () => {
      generator({
        users: [
          { _id: 'admin', _factory: 'admin' },
          {
            _id: 'user',
            firstName: 'Bob',
            lastName: 'Dylan',
            emails: [{ address: 'user@e-potek.ch', verified: true }],
            phoneNumbers: ['123456'],
            intercomId: '12345',
          },
        ],
      });

      IntercomService.getIntercomSettings({ userId: 'user' });

      expect(updateContactOwnerStub.called).to.equal(false);
    });

    it('does not call updateContactOwner if user does not have an assignee', () => {
      generator({
        users: [
          { _id: 'admin', _factory: 'admin' },
          {
            _id: 'user',
            firstName: 'Bob',
            lastName: 'Dylan',
            emails: [{ address: 'user@e-potek.ch', verified: true }],
            phoneNumbers: ['123456'],
          },
        ],
      });

      IntercomService.getIntercomSettings({ userId: 'user' });

      expect(updateContactOwnerStub.called).to.equal(false);
    });
  });

  describe('callIntercomAPI', () => {
    it('throws if endpoint is not configured', () => {
      expect(() =>
        IntercomService.callIntercomAPI({ endpoint: 'unknown' }),
      ).to.throw('Invalid endpoint config');
    });
  });

  describe('getContact', () => {
    let callIntercomAPIStub;

    beforeEach(() => {
      callIntercomAPIStub = sinon.stub(IntercomService, 'callIntercomAPI');
    });

    afterEach(() => {
      callIntercomAPIStub.restore();
    });

    it('fetches the contact by email', async () => {
      callIntercomAPIStub.resolves({ data: [{ id: '12345' }] });

      const contact = await IntercomService.getContact({
        email: 'test@test.com',
      });

      expect(callIntercomAPIStub.args[0]).to.deep.include({
        endpoint: 'searchContacts',
        body: {
          query: {
            field: 'email',
            operator: '=',
            value: 'test@test.com',
          },
        },
      });

      expect(contact.id).to.equal('12345');
    });

    it('returns undefined if no contact is found by email', async () => {
      callIntercomAPIStub.resolves({ error: 'Not found' });

      const contact = await IntercomService.getContact({
        email: 'test@test.com',
      });

      expect(callIntercomAPIStub.args[0]).to.deep.include({
        endpoint: 'searchContacts',
        body: {
          query: {
            field: 'email',
            operator: '=',
            value: 'test@test.com',
          },
        },
      });

      expect(contact).to.equal(undefined);
    });

    it('fetches the contact by id', async () => {
      callIntercomAPIStub.resolves({ id: '12345' });

      const contact = await IntercomService.getContact({
        contactId: '12345',
      });

      expect(callIntercomAPIStub.args[0]).to.deep.include({
        endpoint: 'getContact',
        params: { contactId: '12345' },
      });

      expect(contact.id).to.equal('12345');
    });
  });

  describe('getAdmin', () => {
    let listAdminsStub;

    beforeEach(() => {
      listAdminsStub = sinon.stub(IntercomService, 'listAdmins');
    });

    afterEach(() => {
      listAdminsStub.restore();
    });

    it('returns the intercom admin', async () => {
      listAdminsStub.resolves([{ email: 'admin@e-potek.ch' }]);

      const admin = await IntercomService.getAdmin({
        email: 'admin@e-potek.ch',
      });

      expect(admin).to.deep.include({ email: 'admin@e-potek.ch' });
    });

    it('returns an empty object if the admin is not found', async () => {
      listAdminsStub.resolves([{ email: 'admin@e-potek.ch' }]);

      const admin = await IntercomService.getAdmin({
        email: 'wrong@e-potek.ch',
      });

      expect(Object.keys(admin).length).to.equal(0);
    });
  });

  describe('getIntercomId', () => {
    let setIntercomIdStub;

    beforeEach(() => {
      setIntercomIdStub = sinon.stub(IntercomService, 'setIntercomId');
    });

    afterEach(() => {
      setIntercomIdStub.restore();
    });

    it('does not call setIntercomId if intercomId already exists on the user', async () => {
      generator({ users: { _id: 'user', intercomId: '12345' } });

      const intercomId = await IntercomService.getIntercomId({
        userId: 'user',
      });

      expect(setIntercomIdStub.called).to.equal(false);

      expect(intercomId).to.equal('12345');
    });

    it('calls setIntercomId if does not already exists on the user', async () => {
      setIntercomIdStub.resolves('12345');
      generator({ users: { _id: 'user' } });

      const intercomId = await IntercomService.getIntercomId({
        userId: 'user',
      });

      expect(setIntercomIdStub.args[0]).to.deep.include({ userId: 'user' });

      expect(intercomId).to.equal('12345');
    });
  });

  describe('setIntercomId', () => {
    let getAdminStub;
    let getContactStub;

    beforeEach(() => {
      getAdminStub = sinon.stub(IntercomService, 'getAdmin');
      getContactStub = sinon.stub(IntercomService, 'getContact');
    });

    afterEach(() => {
      getAdminStub.restore();
      getContactStub.restore();
    });

    it('calls getAdmin if user is an advisor', async () => {
      getAdminStub.resolves({ id: 'admin' });
      generator({ users: { _id: 'admin', _factory: 'advisor' } });

      const adminId = await IntercomService.setIntercomId({ userId: 'admin' });

      expect(getAdminStub.called).to.equal(true);
      expect(getContactStub.called).to.equal(false);

      expect(adminId).to.equal('admin');
    });

    it('calls getContact if user is not an advisor', async () => {
      getContactStub.resolves({ id: 'user' });
      generator({ users: { _id: 'user' } });

      const adminId = await IntercomService.setIntercomId({ userId: 'user' });

      expect(getContactStub.called).to.equal(true);
      expect(getAdminStub.called).to.equal(false);

      expect(adminId).to.equal('user');
    });

    it('sets the user intercomId', async () => {
      getContactStub.resolves({ id: 'user' });
      generator({ users: { _id: 'user' } });

      await IntercomService.setIntercomId({ userId: 'user' });

      const { intercomId } = UserService.get('user', { intercomId: 1 });

      expect(intercomId).to.equal('user');
    });

    it('does not set the user intercomId if it is not found', async () => {
      getContactStub.resolves({ error: 'Not found' });
      generator({ users: { _id: 'user' } });

      await IntercomService.setIntercomId({ userId: 'user' });

      const { intercomId } = UserService.get('user', { intercomId: 1 });

      expect(intercomId).to.equal(undefined);
    });
  });

  describe('updateContactOwner', () => {
    let getAdminStub;
    let getContactStub;
    let callIntercomAPIStub;

    beforeEach(() => {
      getAdminStub = sinon.stub(IntercomService, 'getAdmin');
      getContactStub = sinon.stub(IntercomService, 'getContact');
      callIntercomAPIStub = sinon.stub(IntercomService, 'callIntercomAPI');
    });

    afterEach(() => {
      getAdminStub.restore();
      getContactStub.restore();
      callIntercomAPIStub.restore();
    });

    it('calls updateContact endpoint', async () => {
      generator({
        users: [
          { _id: 'admin', _factory: 'advisor', intercomId: 'admin' },
          { _id: 'user', intercomId: 'user' },
        ],
      });

      await IntercomService.updateContactOwner({
        userId: 'user',
        adminId: 'admin',
      });

      expect(callIntercomAPIStub.args[0]).to.deep.include({
        endpoint: 'updateContact',
        params: { contactId: 'user' },
        body: { owner_id: 'admin' },
      });
    });

    it('does not call updateContact endpoint when admin is not found on intercom', async () => {
      getAdminStub.resolves({ error: 'Not found' });
      generator({
        users: [{ _id: 'admin', _factory: 'advisor' }, { _id: 'user' }],
      });

      await IntercomService.updateContactOwner({
        userId: 'user',
        adminId: 'admin',
      });

      expect(callIntercomAPIStub.called).to.equal(false);
    });

    it('does not call updateContact endpoint when user is not found on intercom', async () => {
      getContactStub.resolves({ error: 'Not found' });
      generator({
        users: [{ _id: 'admin', _factory: 'advisor' }, { _id: 'user' }],
      });

      await IntercomService.updateContactOwner({
        userId: 'user',
        adminId: 'admin',
      });

      expect(callIntercomAPIStub.called).to.equal(false);
    });
  });

  describe('updateVisitorTrackingId', () => {
    let isImpersonatedSessionStub;
    let callIntercomAPIStub;

    beforeEach(() => {
      isImpersonatedSessionStub = sinon.stub(
        SessionService.prototype,
        'isImpersonatedSession',
      );
      callIntercomAPIStub = sinon.stub(IntercomService, 'callIntercomAPI');
    });

    afterEach(() => {
      isImpersonatedSessionStub.restore();
      callIntercomAPIStub.restore();
    });

    it('does not call intercomAPI if user is being impersonated', () => {
      isImpersonatedSessionStub.returns(true);

      IntercomService.updateVisitorTrackingId({});

      expect(callIntercomAPIStub.called).to.equal(false);
    });

    it('does not call intercomAPI if no intercom user id is found', () => {
      isImpersonatedSessionStub.returns(false);

      IntercomService.updateVisitorTrackingId({});

      expect(callIntercomAPIStub.called).to.equal(false);

      IntercomService.updateVisitorTrackingId({
        cookies: { some_cookie: 'dude' },
      });

      expect(callIntercomAPIStub.called).to.equal(false);
    });

    it('does not call intercomAPI if no tracking id is found', () => {
      isImpersonatedSessionStub.returns(false);

      IntercomService.updateVisitorTrackingId({ visitorId: 'visitorId' });

      expect(callIntercomAPIStub.called).to.equal(false);
    });

    it('calls intercomAPI when visitorId and trackingId are found', () => {
      isImpersonatedSessionStub.returns(false);

      IntercomService.updateVisitorTrackingId({
        visitorId: 'visitorId',
        cookies: { epotek_trackingid: 'trackingId' },
      });
      IntercomService.updateVisitorTrackingId({
        cookies: {
          'intercom-id-dude': 'visitorId',
          epotek_trackingid: 'trackingId',
        },
      });

      expect(callIntercomAPIStub.calledTwice).to.equal(true);

      callIntercomAPIStub.args.forEach(args => {
        expect(args).to.deep.include({
          endpoint: 'updateVisitor',
          body: {
            user_id: 'visitorId',
            custom_attributes: { epotek_trackingid: 'trackingId' },
          },
        });
      });
    });
  });

  describe('checkWebhookAuthentication', () => {
    let validateIntercomSignatureStub;

    beforeEach(() => {
      validateIntercomSignatureStub = sinon.stub(
        IntercomService,
        'validateIntercomSignature',
      );
    });

    afterEach(() => {
      validateIntercomSignatureStub.restore();
    });

    it('returns correct object when authentication succeeds', () => {
      validateIntercomSignatureStub.returns(true);

      const response = IntercomService.checkWebhookAuthentication({});

      expect(response).to.deep.include({
        isAuthenticated: true,
        error: false,
        user: {
          _id: 'intercom_webhook',
          name: 'Intercom webhook',
          organisations: [{ name: 'Intercom webhook' }],
        },
      });
    });

    it('returns correct object when authentication failed', () => {
      validateIntercomSignatureStub.returns(false);

      const response = IntercomService.checkWebhookAuthentication({});
      const { error } = response;

      expect(response).to.deep.include({
        isAuthenticated: false,
        user: {
          _id: 'intercom_webhook',
          name: 'Intercom webhook',
          organisations: [{ name: 'Intercom webhook' }],
        },
      });

      expect(error.reason).to.include('Intercom signature verification failed');
    });
  });

  describe('validateIntercomSignature', () => {
    it('returns true with a correct signature', () => {
      const data = { hello: 'dude' };
      const signature = crypto
        .createHmac('sha1', CLIENT_SECRET)
        .update(JSON.stringify(data))
        .digest('hex');

      expect(
        IntercomService.validateIntercomSignature(data, `sha1=${signature}`),
      ).to.equal(true);
    });

    it('returns false with an incorrect signature', () => {
      const data = { hello: 'dude' };
      const signature = crypto
        .createHmac('sha1', 'wrong_client_secret')
        .update(JSON.stringify(data))
        .digest('hex');

      expect(
        IntercomService.validateIntercomSignature(data, `sha1=${signature}`),
      ).to.equal(false);
    });
  });

  describe('handleWebhook', () => {
    let handleNewConversationStub;
    let handleAdminResponseStub;
    let handleUserResponseStub;

    beforeEach(() => {
      handleNewConversationStub = sinon.stub(
        IntercomService,
        'handleNewConversation',
      );
      handleAdminResponseStub = sinon.stub(
        IntercomService,
        'handleAdminResponse',
      );
      handleUserResponseStub = sinon.stub(
        IntercomService,
        'handleUserResponse',
      );
    });

    afterEach(() => {
      handleNewConversationStub.restore();
      handleAdminResponseStub.restore();
      handleUserResponseStub.restore();
    });

    it('calls handleNewConversation method when topic is conversation.user.created', async () => {
      handleNewConversationStub.resolves('new conversation');
      const response = await IntercomService.handleWebhook({
        body: { data: { item: 'dude' }, topic: 'conversation.user.created' },
      });

      expect(response).to.equal('new conversation');

      expect(handleNewConversationStub.args[0]).to.deep.include('dude');
    });

    it('calls handleAdminResponse method when topic is conversation.admin.replied', async () => {
      handleAdminResponseStub.resolves('admin replied');
      const response = await IntercomService.handleWebhook({
        body: { data: { item: 'dude' }, topic: 'conversation.admin.replied' },
      });

      expect(response).to.equal('admin replied');

      expect(handleAdminResponseStub.args[0]).to.deep.include('dude');
    });

    it('calls handleUserResponse method when topic is conversation.user.replied', async () => {
      handleUserResponseStub.resolves('user replied');
      const response = await IntercomService.handleWebhook({
        body: { data: { item: 'dude' }, topic: 'conversation.user.replied' },
      });

      expect(response).to.equal('user replied');

      expect(handleUserResponseStub.args[0]).to.deep.include('dude');
    });

    it('returns undefined if topic is unknown', async () => {
      const response = await IntercomService.handleWebhook({
        body: { data: { item: 'dude' }, topic: 'unknown' },
      });

      expect(response).to.equal(undefined);
    });
  });

  describe('handleNewConversation', () => {
    let getContactStub;
    let callIntercomAPIStub;
    let assignConversationStub;
    let analyticsSpy;

    beforeEach(() => {
      getContactStub = sinon.stub(IntercomService, 'getContact');
      callIntercomAPIStub = sinon.stub(IntercomService, 'callIntercomAPI');
      assignConversationStub = sinon.stub(
        IntercomService,
        'assignConversation',
      );
      analyticsSpy = sinon.spy(NoOpAnalytics.prototype, 'track');
    });

    afterEach(() => {
      getContactStub.restore();
      callIntercomAPIStub.restore();
      assignConversationStub.restore();
      NoOpAnalytics.prototype.track.restore();
    });

    it('tracks the event if contact has a tracking id', async () => {
      getContactStub.resolves({
        custom_attributes: { epotek_trackingid: 'trackingId' },
      });

      await IntercomService.handleNewConversation({
        user: { id: 'contactId' },
      });

      expect(analyticsSpy.args[0][0]).to.deep.include({
        anonymousId: 'trackingId',
        event: 'User Started Intercom conversation',
      });
    });

    it('does not track the event if contact has no tracking id', async () => {
      getContactStub.resolves({});

      await IntercomService.handleNewConversation({});

      expect(analyticsSpy.called).to.equal(false);
    });

    it('assigns contact to conversation assignee', async () => {
      getContactStub.resolves({});

      await IntercomService.handleNewConversation({
        user: { id: 'contactId' },
        assignee: { id: 'assigneeId' },
      });

      expect(callIntercomAPIStub.args[0]).to.deep.include({
        endpoint: 'updateContact',
        params: { contactId: 'contactId' },
        body: { owner_id: 'assigneeId' },
      });
    });

    it('does not assign contact to undefined conversation assignee', async () => {
      getContactStub.resolves({});

      await IntercomService.handleNewConversation({});

      expect(callIntercomAPIStub.called).to.equal(false);
    });

    it('assigns conversation to contact owner', async () => {
      getContactStub.resolves({ owner_id: 'assigneeId' });

      await IntercomService.handleNewConversation({
        id: 'conversationId',
        user: { id: 'contactId' },
      });

      expect(assignConversationStub.args[0]).to.deep.include({
        conversationId: 'conversationId',
        assigneeId: 'assigneeId',
      });
    });

    it('assigns conversation to user assignee', async () => {
      getContactStub.resolves({});

      generator({
        users: [
          { _id: 'admin', _factory: 'advisor', intercomId: 'assigneeId' },
          {
            _id: 'user',
            emails: [{ address: 'user@e-potek.ch', verified: true }],
            assignedEmployeeId: 'admin',
          },
        ],
      });

      await IntercomService.handleNewConversation({
        id: 'conversationId',
        user: { id: 'contactId', email: 'user@e-potek.ch' },
      });

      expect(assignConversationStub.args[0]).to.deep.include({
        conversationId: 'conversationId',
        assigneeId: 'assigneeId',
      });
    });

    it('does not assign conversation if no assignee is found', async () => {
      getContactStub.resolves({});

      await IntercomService.handleNewConversation({
        id: 'conversationId',
        user: { id: 'contactId' },
      });

      expect(assignConversationStub.called).to.equal(false);
    });

    it('does not assign conversation if user assignee has no intercomId', async () => {
      getContactStub.resolves({});

      generator({
        users: [
          { _id: 'admin', _factory: 'advisor' },
          {
            _id: 'user',
            emails: [{ address: 'user@e-potek.ch', verified: true }],
            assignedEmployeeId: 'admin',
          },
        ],
      });

      await IntercomService.handleNewConversation({
        id: 'conversationId',
        user: { id: 'contactId', email: 'user@e-potek.ch' },
      });

      expect(assignConversationStub.called).to.equal(false);
    });

    it('does not assign conversation if user has no assignee', async () => {
      getContactStub.resolves({});

      generator({
        users: {
          _id: 'user',
          emails: [{ address: 'user@e-potek.ch', verified: true }],
        },
      });

      await IntercomService.handleNewConversation({
        id: 'conversationId',
        user: { id: 'contactId', email: 'user@e-potek.ch' },
      });

      expect(assignConversationStub.called).to.equal(false);
    });

    it('does not assign conversation if no user is found', async () => {
      getContactStub.resolves({});

      await IntercomService.handleNewConversation({
        id: 'conversationId',
        user: { id: 'contactId', email: 'user@e-potek.ch' },
      });

      expect(assignConversationStub.called).to.equal(false);
    });
  });

  describe('handleAdminResponse', () => {
    let getContactStub;
    let analyticsSpy;
    let callIntercomAPIStub;

    beforeEach(() => {
      getContactStub = sinon.stub(IntercomService, 'getContact');
      callIntercomAPIStub = sinon.stub(IntercomService, 'callIntercomAPI');
      analyticsSpy = sinon.spy(NoOpAnalytics.prototype, 'track');
    });

    afterEach(() => {
      getContactStub.restore();
      callIntercomAPIStub.restore();
      NoOpAnalytics.prototype.track.restore();
    });

    it('tracks the event if contact has a tracking id', async () => {
      getContactStub.resolves({
        custom_attributes: { epotek_trackingid: 'trackingId' },
      });

      generator({
        users: {
          _id: 'admin',
          _factory: 'advisor',
          firstName: 'Admin',
          lastName: 'E-Potek',
          intercomId: 'assigneeId',
        },
      });

      await IntercomService.handleAdminResponse({
        user: { id: 'contactId' },
        assignee: { id: 'assigneeId' },
      });

      expect(analyticsSpy.args[0][0]).to.deep.include({
        anonymousId: 'trackingId',
        event: 'User Received Intercom admin response',
      });

      expect(analyticsSpy.args[0][0].properties).to.deep.include({
        assigneeId: 'admin',
        assigneeName: 'Admin E-Potek',
      });
    });

    it('does not track the event if contact has no tracking id', async () => {
      getContactStub.resolves({});

      await IntercomService.handleAdminResponse({});

      expect(analyticsSpy.called).to.equal(false);
    });

    it('assigns the contact to the replying admin', async () => {
      await IntercomService.handleAdminResponse({
        user: { id: 'contactId' },
        assignee: { id: 'assigneeId' },
      });

      expect(callIntercomAPIStub.args[0]).to.deep.include({
        endpoint: 'updateContact',
        params: { contactId: 'contactId' },
        body: { owner_id: 'assigneeId' },
      });
    });

    it('does not assign the contact to the undefined replying admin', async () => {
      await IntercomService.handleAdminResponse({ user: { id: 'contactId' } });

      expect(callIntercomAPIStub.called).to.equal(false);
    });

    it('does not assign the undefined contact to the replying admin', async () => {
      await IntercomService.handleAdminResponse({
        assignee: { id: 'assigneeId' },
      });

      expect(callIntercomAPIStub.called).to.equal(false);
    });
  });

  describe('handleUserResponse', () => {
    let analyticsSpy;
    let getContactStub;

    beforeEach(() => {
      getContactStub = sinon.stub(IntercomService, 'getContact');
      analyticsSpy = sinon.spy(NoOpAnalytics.prototype, 'track');
    });

    afterEach(() => {
      getContactStub.restore();
      NoOpAnalytics.prototype.track.restore();
    });

    it('tracks the event if contact has a tracking id', async () => {
      getContactStub.resolves({
        custom_attributes: { epotek_trackingid: 'trackingId' },
      });

      generator({
        users: {
          _id: 'admin',
          _factory: 'advisor',
          firstName: 'Admin',
          lastName: 'E-Potek',
          intercomId: 'assigneeId',
        },
      });

      await IntercomService.handleUserResponse({
        user: { id: 'contactId' },
        assignee: { id: 'assigneeId' },
      });

      expect(analyticsSpy.args[0][0]).to.deep.include({
        anonymousId: 'trackingId',
        event: 'User Sent Intercom message',
      });

      expect(analyticsSpy.args[0][0].properties).to.deep.include({
        assigneeId: 'admin',
        assigneeName: 'Admin E-Potek',
      });
    });

    it('does not track the event if contact has no tracking id', async () => {
      getContactStub.resolves({});

      await IntercomService.handleUserResponse({});

      expect(analyticsSpy.called).to.equal(false);
    });
  });
});
