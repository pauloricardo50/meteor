import { Meteor } from 'meteor/meteor';

import { expect } from 'chai';
import crypto from 'crypto';
import sinon from 'sinon';

import { resetDatabase } from '../../../../utils/testHelpers';
import NoOpAnalytics from '../../../analytics/server/NoOpAnalytics';
import ErrorLogger from '../../../errorLogger/server/ErrorLogger';
import generator from '../../../factories/server';
import { SessionService } from '../../../sessions/server/SessionService';
import UserService from '../../../users/server/UserService';
import IntercomService from '../IntercomService';

const VISITOR_INTERCOM_ID = '62bfe474-6e1c-4e50-995e-65a49d76919d';
const VISITOR_INTERCOM_PSEUDO = 'Lilac Radio from Delémont';
const CONTACT_INTERCOM_ID = '5eeb65f7b27fa3d57a2b431d';
const CONTACT_INTERCOM_EMAIL = 'digital+intercom@e-potek.ch';
const CONTACT_INTERCOM_VISITOR_ID = '81ea6a62-18b4-4981-aeb1-902afef1f86c';
const CONTACT_INTERCOM_NAME = 'Test User';
const ADMIN_INTERCOM_ID = '3829629';
const ADMIN_INTERCOM_EMAIL = 'quentin@e-potek.ch';
const CONVERSATION_INTERCOM_ID = '97872100000001';

const resetContact = () =>
  IntercomService.updateContact({
    contactId: CONTACT_INTERCOM_ID,
    owner_id: null,
    custom_attributes: {
      epotek_trackingid: null,
      test: null,
    },
  });

const resetVisitor = () =>
  IntercomService.updateVisitor({
    visitorId: VISITOR_INTERCOM_ID,
    custom_attributes: {
      epotek_trackingid: null,
      test: null,
    },
  });

const resetConversation = () =>
  IntercomService.assignConversation({
    conversationId: CONVERSATION_INTERCOM_ID,
    adminId: ADMIN_INTERCOM_ID,
    assigneeId: '0',
  });

describe('IntercomService', function () {
  this.timeout(15000);
  let logErrorSpy;

  beforeEach(async function () {
    resetDatabase();
    logErrorSpy = sinon.spy(ErrorLogger, 'logError');
  });

  afterEach(() => {
    logErrorSpy.restore();
  });

  describe('searchContacts', () => {
    it('returns the contacts with a filter on email', async () => {
      const { data = [] } = await IntercomService.searchContacts({
        filters: { email: { value: CONTACT_INTERCOM_EMAIL } },
      });

      expect(data.length).to.equal(1);
      const [contact] = data;

      expect(contact).to.deep.include({
        email: CONTACT_INTERCOM_EMAIL,
        name: CONTACT_INTERCOM_NAME,
      });
    });

    it('returns the contacts with filters on name and email', async () => {
      const { data = [] } = await IntercomService.searchContacts({
        filters: {
          name: { value: CONTACT_INTERCOM_NAME },
          email: { value: CONTACT_INTERCOM_EMAIL },
        },
      });

      expect(data.length).to.equal(1);
      const [contact] = data;

      expect(contact).to.deep.include({
        email: CONTACT_INTERCOM_EMAIL,
        name: CONTACT_INTERCOM_NAME,
      });
    });

    it('returns empty array if no contact is found', async () => {
      const { data = [] } = await IntercomService.searchContacts({
        filters: { id: 'wrong' },
      });

      expect(data.length).to.equal(0);
    });
  });

  describe('getContact', () => {
    it('returns a contact', async () => {
      const contact = await IntercomService.getContact({
        contactId: CONTACT_INTERCOM_ID,
      });

      expect(contact).to.deep.include({
        email: CONTACT_INTERCOM_EMAIL,
        name: CONTACT_INTERCOM_NAME,
      });
    });

    it('returns undefined if contact is not found', async () => {
      const contact = await IntercomService.getContact({
        contactId: 'wrong',
      });

      expect(logErrorSpy.args[0][0].error.message).to.include('User Not Found');
      expect(contact).to.equal(undefined);
    });
  });

  describe('updateContact', () => {
    before(async () => {
      await resetContact();
    });

    it('updates a contact and returns the updated contact', async () => {
      const contact = await IntercomService.updateContact({
        contactId: CONTACT_INTERCOM_ID,
        custom_attributes: { test: 'test' },
      });

      expect(contact?.custom_attributes?.test).to.equal('test');
    });

    it('returns undefined if contact is not found', async () => {
      const contact = await IntercomService.updateContact({
        contactId: 'wrong',
        custom_attributes: { test: 'test' },
      });

      expect(logErrorSpy.args[0][0].error.message).to.include('User Not Found');
      expect(contact).to.equal(undefined);
    });
  });

  describe('listAdmins', () => {
    it('returns a list of admins', async () => {
      const { admins = [] } = await IntercomService.listAdmins();

      // Can't assert on specific admins length, as it changes when an admin is added to intercom
      expect(admins.length).to.not.equal(0);
    });
  });

  describe('getVisitor', () => {
    it('returns a visitor', async () => {
      const visitor = await IntercomService.getVisitor({
        visitorId: VISITOR_INTERCOM_ID,
      });

      expect(visitor).to.deep.include({
        pseudonym: VISITOR_INTERCOM_PSEUDO,
      });
    });

    it('returns undefined if no visitor is found', async () => {
      const visitor = await IntercomService.getVisitor({
        visitorId: 'wrong',
      });

      expect(logErrorSpy.args[0][0].error.message).to.include(
        'Visitor Not Found',
      );
      expect(visitor).to.equal(undefined);
    });
  });

  describe('updateVisitor', () => {
    before(async () => {
      await resetVisitor();
    });

    it('updates a visitor', async () => {
      const visitor = await IntercomService.updateVisitor({
        visitorId: VISITOR_INTERCOM_ID,
        custom_attributes: { test: 'test' },
      });

      expect(visitor.custom_attributes).to.deep.include({ test: 'test' });
    });

    it('returns undefined if visitor is not found', async () => {
      const visitor = await IntercomService.updateVisitor({
        visitorId: 'wrong',
        custom_attributes: { test: 'test' },
      });

      expect(logErrorSpy.args[0][0].error.message).to.include(
        'Visitor Not Found',
      );
      expect(visitor).to.equal(undefined);
    });
  });

  describe('assignConversation', () => {
    before(async () => {
      await resetConversation();
    });

    it('assigns a conversation', async () => {
      const conversation = await IntercomService.assignConversation({
        conversationId: CONVERSATION_INTERCOM_ID,
        assigneeId: ADMIN_INTERCOM_ID,
      });

      const { assignee } = conversation;

      expect(assignee.id).to.equal(ADMIN_INTERCOM_ID);
    });

    // We don't use conversation un-assignments
    it.skip('unassigns a conversation', async function () {
      this.timeout(15000);
      await IntercomService.assignConversation({
        conversationId: CONVERSATION_INTERCOM_ID,
        assigneeId: ADMIN_INTERCOM_ID,
      });
      const { assignee } = await IntercomService.assignConversation({
        conversationId: CONVERSATION_INTERCOM_ID,
        assigneeId: '0',
        adminId: ADMIN_INTERCOM_ID,
      });
      expect(assignee).to.equal(null);
    });

    it('returns undefined if conversation is not found', async () => {
      const conversation = await IntercomService.assignConversation({
        conversationId: 'wrong',
        assigneeId: ADMIN_INTERCOM_ID,
      });
      expect(logErrorSpy.args[0][0].error.message).to.include(
        'Resource Not Found',
      );
      expect(conversation).to.equal(undefined);
    });

    it('returns undefined if no assigneeId is given', async () => {
      const conversation = await IntercomService.assignConversation({
        conversationId: CONVERSATION_INTERCOM_ID,
      });
      expect(logErrorSpy.args[0][0].error.message).to.include('ID is required');
      expect(conversation).to.equal(undefined);
    });
  });

  describe('getIntercomSettings', () => {
    let updateContactOwnerSpy;

    beforeEach(async () => {
      updateContactOwnerSpy = sinon.spy(IntercomService, 'updateContactOwner');
    });

    before(async () => {
      await resetContact();
    });

    afterEach(() => {
      updateContactOwnerSpy.restore();
    });

    it('returns intercom settings for logged in user', async () => {
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

      const settings = await IntercomService.getIntercomSettings({
        userId: 'user',
      });
      expect(settings).to.deep.include({
        email: 'user@e-potek.ch',
        name: 'Bob Dylan',
        phone: '+41 123456',
      });
      expect(settings.user_hash).to.not.equal(undefined);
    });

    it('returns only app_id for logged out user', async () => {
      const settings = await IntercomService.getIntercomSettings({});
      expect(settings.app_id).to.not.equal(undefined);
      expect(settings.user_hash).to.equal(undefined);
    });

    it('updates the contact owner if required', async () => {
      generator({
        users: [
          { _id: 'admin', _factory: 'admin', intercomId: ADMIN_INTERCOM_ID },
          {
            _id: 'user',
            firstName: 'Bob',
            lastName: 'Dylan',
            emails: [{ address: CONTACT_INTERCOM_EMAIL, verified: true }],
            phoneNumbers: ['123456'],
            assignedEmployeeId: 'admin',
          },
        ],
      });

      await IntercomService.getIntercomSettings({ userId: 'user' });

      const contact = await IntercomService.getContact({
        contactId: CONTACT_INTERCOM_ID,
      });

      expect(String(contact.owner_id)).to.equal(ADMIN_INTERCOM_ID);
    });

    it('does not call updateContactOwner if user has an intercomId', async () => {
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

      await IntercomService.getIntercomSettings({ userId: 'user' });

      expect(updateContactOwnerSpy.called).to.equal(false);
    });

    it('does not call updateContactOwner if user does not have an assignee', async () => {
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

      await IntercomService.getIntercomSettings({ userId: 'user' });

      expect(updateContactOwnerSpy.called).to.equal(false);
    });
  });

  describe('getAdmin', () => {
    it('returns the intercom admin', async () => {
      const admin = await IntercomService.getAdmin({
        email: ADMIN_INTERCOM_EMAIL,
      });

      expect(admin).to.deep.include({ email: ADMIN_INTERCOM_EMAIL });
    });

    it('returns undefined if the admin is not found', async () => {
      const admin = await IntercomService.getAdmin({
        email: 'wrong@e-potek.ch',
      });

      expect(admin).to.equal(undefined);
    });
  });

  describe('getIntercomId', () => {
    it('returns intercomId already existing on the user', async () => {
      generator({
        users: {
          _id: 'user',
          intercomId: '12345',
          emails: [{ address: CONTACT_INTERCOM_EMAIL, verified: true }],
        },
      });

      const intercomId = await IntercomService.getIntercomId({
        userId: 'user',
      });

      expect(intercomId).to.equal('12345');
    });

    it('sets intercomId on the user if it does not already exist', async () => {
      generator({
        users: {
          _id: 'user',
          emails: [{ address: CONTACT_INTERCOM_EMAIL, verified: true }],
        },
      });

      const intercomId = await IntercomService.getIntercomId({
        userId: 'user',
      });

      const user = UserService.get('user', { intercomId: 1 });

      expect(intercomId).to.equal(CONTACT_INTERCOM_ID);
      expect(user.intercomId).to.equal(CONTACT_INTERCOM_ID);
    });

    it('gets an admin intercomId', async () => {
      generator({
        users: {
          _id: 'admin',
          _factory: 'advisor',
          emails: [{ address: ADMIN_INTERCOM_EMAIL, verified: true }],
        },
      });

      const intercomId = await IntercomService.getIntercomId({
        userId: 'admin',
      });

      const admin = UserService.get('admin', { intercomId: 1 });

      expect(intercomId).to.equal(ADMIN_INTERCOM_ID);
      expect(admin.intercomId).to.equal(ADMIN_INTERCOM_ID);
    });

    it('returns undefined if user is not found on intercom', async () => {
      generator({
        users: {
          _id: 'user',
          emails: [{ address: 'user@e-potek.ch', verified: true }],
        },
      });

      const intercomId = await IntercomService.getIntercomId({
        userId: 'user',
      });

      expect(intercomId).to.equal(undefined);
    });
  });

  describe('updateContactOwner', () => {
    before(async () => {
      await resetContact();
    });

    it('does not update the contact owner when admin is not found on intercom', async () => {
      generator({
        users: [
          { _id: 'admin', _factory: 'advisor' },
          { _id: 'user', intercomId: CONTACT_INTERCOM_ID },
        ],
      });

      const response = await IntercomService.updateContactOwner({
        userId: 'user',
        adminId: 'admin',
      });

      const contact = await IntercomService.getContact({
        contactId: CONTACT_INTERCOM_ID,
      });

      expect(response).to.equal(undefined);
      expect(contact.owner_id).to.equal(null);
    });

    it('does not update the contact owner when contact is not found on intercom', async () => {
      generator({
        users: [
          { _id: 'admin', _factory: 'advisor', intercomId: ADMIN_INTERCOM_ID },
          { _id: 'user' },
        ],
      });

      const response = await IntercomService.updateContactOwner({
        userId: 'user',
        adminId: 'admin',
      });

      const contact = await IntercomService.getContact({
        contactId: CONTACT_INTERCOM_ID,
      });

      expect(response).to.equal(undefined);
      expect(contact.owner_id).to.equal(null);
    });

    it('updates the contact owner', async () => {
      generator({
        users: [
          {
            _id: 'admin',
            _factory: 'advisor',
            intercomId: ADMIN_INTERCOM_ID,
          },
          {
            _id: 'user',
            emails: [{ address: CONTACT_INTERCOM_EMAIL, verified: true }],
          },
        ],
      });

      const contact = await IntercomService.updateContactOwner({
        userId: 'user',
        adminId: 'admin',
      });

      expect(String(contact.owner_id)).to.equal(ADMIN_INTERCOM_ID);
    });
  });

  describe('getContactByEmail', () => {
    it('returns a contact', async () => {
      const contact = await IntercomService.getContactByEmail({
        email: CONTACT_INTERCOM_EMAIL,
      });
      expect(contact).to.deep.include({
        name: CONTACT_INTERCOM_NAME,
        email: CONTACT_INTERCOM_EMAIL,
        id: CONTACT_INTERCOM_ID,
      });
    });

    it('returns undefined if no contact was found', async () => {
      const contact = await IntercomService.getContactByEmail({
        email: 'user@e-potek.ch',
      });
      expect(contact).to.equal(undefined);
    });
  });

  describe('getContactByVisitorId', () => {
    it('returns a contact', async () => {
      const contact = await IntercomService.getContactByVisitorId({
        visitorId: CONTACT_INTERCOM_VISITOR_ID,
      });
      expect(contact).to.deep.include({
        name: CONTACT_INTERCOM_NAME,
        email: CONTACT_INTERCOM_EMAIL,
        id: CONTACT_INTERCOM_ID,
      });
    });

    it('returns undefined if no contact was found', async () => {
      const contact = await IntercomService.getContactByVisitorId({
        visitorId: 'wrong',
      });
      expect(contact).to.equal(undefined);
    });
  });

  describe('updateVisitorTrackingId', () => {
    let isImpersonatedSessionStub;

    beforeEach(() => {
      isImpersonatedSessionStub = sinon.stub(
        SessionService.prototype,
        'isImpersonatedSession',
      );
    });

    afterEach(() => {
      isImpersonatedSessionStub.restore();
    });

    before(async () => {
      await resetVisitor();
      await resetContact();
    });

    it('does not update visitor if user is being impersonated', async () => {
      isImpersonatedSessionStub.returns(true);

      const response = await IntercomService.updateVisitorTrackingId({
        visitorId: VISITOR_INTERCOM_ID,
      });

      const visitor = await IntercomService.getVisitor({
        visitorId: VISITOR_INTERCOM_ID,
      });
      expect(response).to.equal(undefined);
      expect(visitor.custom_attributes.epotek_trackingid).to.equal(null);
    });

    it('does not update visitor if no visitorId is provided', async () => {
      isImpersonatedSessionStub.returns(false);

      const response = await IntercomService.updateVisitorTrackingId({});
      expect(response).to.equal(undefined);
    });

    it('does not update visitor if no trackingId is provided', async () => {
      isImpersonatedSessionStub.returns(false);

      const response = await IntercomService.updateVisitorTrackingId({
        visitorId: VISITOR_INTERCOM_ID,
      });
      const visitor = await IntercomService.getVisitor({
        visitorId: VISITOR_INTERCOM_ID,
      });
      expect(response).to.equal(undefined);
      expect(visitor.custom_attributes.epotek_trackingid).to.equal(null);
    });

    it('does not update visitor if visitor is not found on intercom', async () => {
      isImpersonatedSessionStub.returns(false);

      const response = await IntercomService.updateVisitorTrackingId({
        visitorId: 'wrong',
        trackingId: '12345',
      });
      expect(logErrorSpy.args[0][0].error.message).to.include(
        'Visitor Not Found',
      );
      expect(response).to.equal(undefined);
    });

    it('does not update visitor if it already has a tracking id', async () => {
      isImpersonatedSessionStub.returns(false);

      await IntercomService.updateVisitorTrackingId({
        visitorId: VISITOR_INTERCOM_ID,
        trackingId: '12345',
      });

      const response = await IntercomService.updateVisitorTrackingId({
        visitorId: VISITOR_INTERCOM_ID,
        trackingId: '54321',
      });

      const visitor = await IntercomService.getVisitor({
        visitorId: VISITOR_INTERCOM_ID,
      });

      expect(response).to.equal(undefined);
      expect(visitor.custom_attributes).to.deep.include({
        epotek_trackingid: '12345',
      });
    });

    it('updates the visitor tracking id', async () => {
      isImpersonatedSessionStub.returns(false);
      await resetVisitor();

      const visitor = await IntercomService.updateVisitorTrackingId({
        visitorId: VISITOR_INTERCOM_ID,
        trackingId: '12345',
      });

      expect(visitor.custom_attributes).to.deep.include({
        epotek_trackingid: '12345',
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
        .createHmac('sha1', Meteor.settings.intercom.CLIENT_SECRET)
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
    it('returns undefined if topic is unknown', async () => {
      const response = await IntercomService.handleWebhook({
        body: { data: { item: 'dude' }, topic: 'unknown' },
      });

      expect(response).to.equal(undefined);
    });
  });

  describe('handleNewConversation', () => {
    let analyticsSpy;
    let assignConversationStub;

    beforeEach(() => {
      analyticsSpy = sinon.spy(NoOpAnalytics.prototype, 'track');
      // We stub assignConversation here because this endpoint is really slow
      assignConversationStub = sinon.stub(
        IntercomService,
        'assignConversation',
      );
    });

    afterEach(() => {
      NoOpAnalytics.prototype.track.restore();
      assignConversationStub.restore();
    });

    before(async () => {
      await resetContact();
    });

    it('does not track the event if contact has no tracking id', async () => {
      await IntercomService.handleNewConversation({
        id: CONVERSATION_INTERCOM_ID,
        user: { id: CONTACT_INTERCOM_ID, email: CONTACT_INTERCOM_EMAIL },
      });

      expect(analyticsSpy.called).to.equal(false);
    });

    it('does not assign contact to undefined conversation assignee', async () => {
      await IntercomService.handleNewConversation({
        id: CONVERSATION_INTERCOM_ID,
        user: { id: CONTACT_INTERCOM_ID, email: CONTACT_INTERCOM_EMAIL },
      });

      const contact = await IntercomService.getContact({
        contactId: CONTACT_INTERCOM_ID,
      });

      expect(contact.owner_id).to.equal(null);
    });

    it('does not assign conversation if no assignee is found', async () => {
      const response = await IntercomService.handleNewConversation({
        id: CONVERSATION_INTERCOM_ID,
        user: { id: CONTACT_INTERCOM_ID, email: CONTACT_INTERCOM_EMAIL },
      });

      expect(response).to.equal(undefined);
    });

    it('does not assign conversation if user assignee has no intercomId', async () => {
      generator({
        users: [
          { _id: 'admin', _factory: 'advisor' },
          {
            _id: 'user',
            emails: [{ address: CONTACT_INTERCOM_EMAIL, verified: true }],
            assignedEmployeeId: 'admin',
          },
        ],
      });

      const response = await IntercomService.handleNewConversation({
        id: CONVERSATION_INTERCOM_ID,
        user: { id: CONTACT_INTERCOM_ID, email: CONTACT_INTERCOM_EMAIL },
      });

      expect(response).to.equal(undefined);
    });

    it('does not assign conversation if user has no assignee', async () => {
      generator({
        users: {
          _id: 'user',
          emails: [{ address: CONTACT_INTERCOM_EMAIL, verified: true }],
        },
      });

      const response = await IntercomService.handleNewConversation({
        id: CONVERSATION_INTERCOM_ID,
        user: { id: CONTACT_INTERCOM_ID, email: CONTACT_INTERCOM_EMAIL },
      });

      expect(response).to.equal(undefined);
    });

    it('does not assign conversation if no user is found', async () => {
      const response = await IntercomService.handleNewConversation({
        id: CONVERSATION_INTERCOM_ID,
        user: { id: 'wrong' },
      });

      expect(response).to.equal(undefined);
    });

    it('tracks the event if contact has a tracking id', async () => {
      await IntercomService.updateContact({
        contactId: CONTACT_INTERCOM_ID,
        custom_attributes: { epotek_trackingid: 'trackingId' },
      });
      await IntercomService.handleNewConversation({
        id: CONVERSATION_INTERCOM_ID,
        user: { id: CONTACT_INTERCOM_ID, email: CONTACT_INTERCOM_EMAIL },
      });

      expect(analyticsSpy.args[0][0]).to.deep.include({
        anonymousId: 'trackingId',
        event: 'User Started Intercom conversation',
      });
    });

    it('assigns contact to conversation assignee', async () => {
      await IntercomService.handleNewConversation({
        id: CONVERSATION_INTERCOM_ID,
        user: { id: CONTACT_INTERCOM_ID, email: CONTACT_INTERCOM_EMAIL },
        assignee: { id: ADMIN_INTERCOM_ID },
      });

      const contact = await IntercomService.getContact({
        contactId: CONTACT_INTERCOM_ID,
      });

      expect(String(contact.owner_id)).to.equal(ADMIN_INTERCOM_ID);
    });

    it('assigns conversation to contact owner', async () => {
      assignConversationStub.resolves({});
      await IntercomService.updateContact({
        contactId: CONTACT_INTERCOM_ID,
        owner_id: ADMIN_INTERCOM_ID,
      });

      await IntercomService.handleNewConversation({
        id: CONVERSATION_INTERCOM_ID,
        user: { id: CONTACT_INTERCOM_ID, email: CONTACT_INTERCOM_EMAIL },
      });

      expect(assignConversationStub.args[0][0]).to.deep.include({
        conversationId: CONVERSATION_INTERCOM_ID,
        assigneeId: Number(ADMIN_INTERCOM_ID),
      });
    });

    it('assigns conversation to user assignee', async () => {
      assignConversationStub.resolves({});
      generator({
        users: [
          { _id: 'admin', _factory: 'advisor', intercomId: ADMIN_INTERCOM_ID },
          {
            _id: 'user',
            emails: [{ address: CONTACT_INTERCOM_EMAIL, verified: true }],
            assignedEmployeeId: 'admin',
          },
        ],
      });

      await IntercomService.handleNewConversation({
        id: CONVERSATION_INTERCOM_ID,
        user: { id: CONTACT_INTERCOM_ID, email: CONTACT_INTERCOM_EMAIL },
      });

      expect(assignConversationStub.args[0][0]).to.deep.include({
        conversationId: CONVERSATION_INTERCOM_ID,
        assigneeId: Number(ADMIN_INTERCOM_ID),
      });
    });
  });

  describe('handleAdminResponse', () => {
    let analyticsSpy;

    beforeEach(() => {
      analyticsSpy = sinon.spy(NoOpAnalytics.prototype, 'track');
    });

    afterEach(() => {
      NoOpAnalytics.prototype.track.restore();
    });

    before(async () => {
      await resetContact();
    });

    it('does not track the event if contact has no tracking id', async () => {
      await IntercomService.handleAdminResponse({
        user: { id: CONTACT_INTERCOM_ID },
        assignee: { id: ADMIN_INTERCOM_ID },
      });

      expect(analyticsSpy.called).to.equal(false);
    });

    it('tracks the event if contact has a tracking id', async () => {
      await IntercomService.updateContact({
        contactId: CONTACT_INTERCOM_ID,
        custom_attributes: { epotek_trackingid: 'trackingId' },
      });

      generator({
        users: [
          {
            _id: 'admin',
            _factory: 'advisor',
            firstName: 'Admin',
            lastName: 'E-Potek',
            intercomId: ADMIN_INTERCOM_ID,
          },
          {
            _id: 'user',
            assignedEmployeeId: 'admin',
            emails: [{ address: CONTACT_INTERCOM_EMAIL, verified: true }],
          },
        ],
      });

      await IntercomService.handleAdminResponse({
        user: { id: CONTACT_INTERCOM_ID, email: CONTACT_INTERCOM_EMAIL },
        assignee: { id: ADMIN_INTERCOM_ID },
      });

      expect(analyticsSpy.args[0][0]).to.deep.include({
        anonymousId: 'trackingId',
        event: 'User Received Intercom admin response',
      });

      expect(analyticsSpy.args[0][0].properties).to.deep.include({
        assigneeId: 'admin',
        assigneeName: 'Admin E-Potek',
        answeringAdminId: 'admin',
        answeringAdminName: 'Admin E-Potek',
      });
    });

    it('does not assign the contact to the undefined replying admin', async () => {
      await resetContact();
      const response = await IntercomService.handleAdminResponse({
        user: { id: CONTACT_INTERCOM_ID },
      });
      const contact = await IntercomService.getContact({
        contactId: CONTACT_INTERCOM_ID,
      });
      expect(response).to.equal(undefined);
      expect(contact.owner_id).to.equal(null);
    });

    it('assigns the contact to the replying admin', async () => {
      const contact = await IntercomService.handleAdminResponse({
        user: { id: CONTACT_INTERCOM_ID },
        assignee: { id: ADMIN_INTERCOM_ID },
      });

      expect(String(contact.owner_id)).to.equal(ADMIN_INTERCOM_ID);
    });
  });

  describe('handleUserResponse', () => {
    let analyticsSpy;

    beforeEach(() => {
      analyticsSpy = sinon.spy(NoOpAnalytics.prototype, 'track');
    });

    afterEach(() => {
      NoOpAnalytics.prototype.track.restore();
    });

    before(async () => {
      await resetContact();
    });

    it('does not track the event if contact has no tracking id', async () => {
      generator({
        users: [
          {
            _id: 'admin',
            _factory: 'advisor',
            firstName: 'Admin',
            lastName: 'E-Potek',
            intercomId: ADMIN_INTERCOM_ID,
          },
          {
            _id: 'user',
            assignedEmployeeId: 'admin',
            emails: [{ address: CONTACT_INTERCOM_EMAIL, verified: true }],
          },
        ],
      });

      await IntercomService.handleUserResponse({
        user: { id: CONTACT_INTERCOM_ID, email: CONTACT_INTERCOM_EMAIL },
      });

      expect(analyticsSpy.called).to.equal(false);
    });

    it('tracks the event if contact has a tracking id', async () => {
      await IntercomService.updateContact({
        contactId: CONTACT_INTERCOM_ID,
        custom_attributes: { epotek_trackingid: 'trackingId' },
      });

      generator({
        users: [
          {
            _id: 'admin',
            _factory: 'advisor',
            firstName: 'Admin',
            lastName: 'E-Potek',
            intercomId: ADMIN_INTERCOM_ID,
          },
          {
            _id: 'user',
            assignedEmployeeId: 'admin',
            emails: [{ address: CONTACT_INTERCOM_EMAIL, verified: true }],
          },
        ],
      });

      await IntercomService.handleUserResponse({
        user: { id: CONTACT_INTERCOM_ID, email: CONTACT_INTERCOM_EMAIL },
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
  });
});
