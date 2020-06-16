import { expect } from 'chai';
import sinon from 'sinon';

import { resetDatabase } from '../../../../utils/testHelpers';
import generator from '../../../factories/server';
import UserService from '../../../users/server/UserService';
import { IntercomService as IntercomServiceClass } from '../IntercomService';

const fetchStub = sinon.stub();
const IntercomService = new IntercomServiceClass({
  fetch: fetchStub,
  isEnabled: true,
});

describe('IntercomService', () => {
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

    it('returns empty object if no contact is found by email', async () => {
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

      expect(Object.keys(contact).length).to.equal(0);
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
});
