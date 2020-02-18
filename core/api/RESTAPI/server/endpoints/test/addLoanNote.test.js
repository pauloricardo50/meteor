import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';

import TaskService from '../../../../tasks/server/TaskService';
import generator from '../../../../factories/server';
import {
  getTimestampAndNonce,
  fetchAndCheckResponse,
  makeHeaders,
} from '../../test/apiTestHelpers.test';
import RESTAPI from '../../RESTAPI';
import addLoanNoteAPI from '../addLoanNote';
import { HTTP_STATUS_CODES } from '../../restApiConstants';

const api = new RESTAPI();
api.addEndpoint('/loans/add-note', 'POST', addLoanNoteAPI, {
  rsaAuth: true,
  endpointName: 'Add note to a loan',
});

const addNote = ({
  loanId,
  note,
  expectedResponse,
  status,
  userId,
  impersonateUser,
}) => {
  const { timestamp, nonce } = getTimestampAndNonce();
  const body = { loanId, note };
  const query = impersonateUser
    ? { 'impersonate-user': impersonateUser }
    : undefined;
  return fetchAndCheckResponse({
    url: `/loans/add-note`,
    query,
    data: {
      method: 'POST',
      headers: makeHeaders({ userId, timestamp, nonce, body, query }),
      body: JSON.stringify(body),
    },
    expectedResponse,
    status,
  });
};

describe('REST: addLoanNote', function() {
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
          _id: 'pro1',
          _factory: 'pro',
          firstName: 'Pro',
          lastName: 'One',
          organisations: { _id: 'org1', name: 'org1' },
          emails: [{ address: 'pro1@org1.com', verified: true }],
          isDisabled: false,
        },
        {
          _id: 'pro2',
          _factory: 'pro',
          firstName: 'Pro',
          lastName: 'Two',
          organisations: { _id: 'org1' },
          emails: [{ address: 'pro2@org1.com', verified: true }],
          isDisabled: false,
        },
        {
          _id: 'pro3',
          _factory: 'pro',
          firstName: 'Pro',
          lastName: 'Three',
          organisations: { _id: 'org2', name: 'org2' },
          emails: [{ address: 'pro3@org2.com', verified: true }],
          isDisabled: false,
        },
        {
          _id: 'user1',
          _factory: 'user',
          referredByUserLink: 'pro1',
          loans: [{ _id: 'loan1' }],
          assignedEmployeeId: 'admin',
        },
        {
          _id: 'user2',
          _factory: 'user',
          referredByOrganisationLink: 'org1',
          loans: [{ _id: 'loan2' }],
          assignedEmployeeId: 'admin',
        },
      ],
    });
  });

  it('adds a note to a loan', async () => {
    const note = 'Test note';
    const { status, message, note: noteResponse } = await addNote({
      loanId: 'loan1',
      note,
      userId: 'pro1',
    });
    expect(status).to.equal(HTTP_STATUS_CODES.OK);
    expect(message).to.include('Successfully');
    expect(noteResponse).to.equal(note);

    const {
      title,
      description,
      assignee: { _id: assigneeId },
    } = TaskService.get(
      { 'loanLink._id': 'loan1' },
      { title: 1, description: 1, assignee: { _id: 1 } },
    );

    expect(title).to.include('Pro One');
    expect(title).to.include('org1');
    expect(description).to.equal(note);
    expect(assigneeId).to.equal('admin');
  });

  it('adds a note to a loan when impersonating', async () => {
    const note = 'Test note';
    const { status, message, note: noteResponse } = await addNote({
      loanId: 'loan2',
      note,
      userId: 'pro1',
      impersonateUser: 'pro2@org1.com',
    });
    expect(status).to.equal(HTTP_STATUS_CODES.OK);
    expect(message).to.include('Successfully');
    expect(noteResponse).to.equal(note);

    const {
      title,
      description,
      assignee: { _id: assigneeId },
    } = TaskService.get(
      { 'loanLink._id': 'loan2' },
      { title: 1, description: 1, assignee: { _id: 1 } },
    );

    expect(title).to.include('Pro Two');
    expect(title).to.include('org1');
    expect(description).to.equal(note);
    expect(assigneeId).to.equal('admin');
  });

  it('throws if loan does not exist', async () => {
    const note = 'Test note';
    const { status, message } = await addNote({
      loanId: 'wrong',
      note,
      userId: 'pro1',
      impersonateUser: 'pro2@org1.com',
    });
    expect(status).to.equal(HTTP_STATUS_CODES.NOT_FOUND);
    expect(message).to.include('No loan found');
  });

  it('throws if pro does not have access to the loan', async () => {
    const note = 'Test note';
    const { status, message } = await addNote({
      loanId: 'loan1',
      note,
      userId: 'pro3',
    });
    expect(status).to.equal(HTTP_STATUS_CODES.NOT_FOUND);
    expect(message).to.include('No loan found');
  });

  it('throws if no note is sent', async () => {
    const { status, message } = await addNote({
      loanId: 'loan1',
      userId: 'pro1',
    });
    expect(status).to.equal(HTTP_STATUS_CODES.BAD_REQUEST);
    expect(message).to.include("Missing key 'note'");
  });
});
