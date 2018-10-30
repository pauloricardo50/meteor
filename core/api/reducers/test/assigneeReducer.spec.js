// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import UserService from '../../users/UserService';
import assigneeReducer from '../assigneeReducer';

const defaultReducer = assigneeReducer().assignee.reduce;

describe.only('assigneeReducer', () => {
  beforeEach(() => {
    sinon
      .stub(UserService, 'findOne')
      .callsFake(({ userId }) => ({ userId, assignedEmployeeId: 'adminId' }));
  });

  afterEach(() => {
    UserService.findOne.restore();
  });

  it('works with a userId', () => {
    const result = defaultReducer({ userId: 'myUserId' });

    expect(result).to.deep.include({ userId: 'adminId' });
    expect(UserService.findOne.firstCall.args[0]).to.deep.equal({
      userId: 'myUserId',
    });
  });

  it('returns the assignedEmployee if assignedEmployeeId is found', () => {
    const result = defaultReducer({ assignedEmployeeId: 'assignee' });

    expect(result).to.deep.include({ userId: 'assignee' });
    expect(UserService.findOne.lastCall.args[0]).to.deep.equal({
      userId: 'assignee',
    });
  });

  it("returns the promotion's first user", () => {
    const result = defaultReducer({
      promotion: { userLinks: [{ _id: 'test2' }] },
    });

    expect(UserService.findOne.firstCall.args[0]).to.deep.equal({
      userId: 'test2',
    });
    expect(result).to.deep.include({ userId: 'adminId' });
  });

  it("returns the promotions' first user", () => {
    const result = defaultReducer({
      promotions: [{ userLinks: [{ _id: 'test2' }] }],
    });

    expect(UserService.findOne.firstCall.args[0]).to.deep.equal({
      userId: 'test2',
    });
    expect(result).to.deep.include({ userId: 'adminId' });
  });

  it('works with a custom function', () => {
    const reducer = assigneeReducer({}, ({ data }) => data.someId).assignee
      .reduce;

    const result = reducer({
      data: { someId: 'dude' },
    });

    expect(UserService.findOne.firstCall.args[0]).to.deep.equal({
      userId: 'dude',
    });
    expect(result).to.deep.include({ userId: 'adminId' });
  });
});
