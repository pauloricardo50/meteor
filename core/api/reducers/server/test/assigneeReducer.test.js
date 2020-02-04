//      
/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import UserService from '../../../users/server/UserService';
import assigneeReducer from '../../assigneeReducer';

const defaultReducer = assigneeReducer().assignee.reduce;

describe('assigneeReducer', () => {
  beforeEach(() => {
    sinon
      .stub(UserService, 'get')
      .callsFake(id => ({ userId: id, assignedEmployeeId: 'adminId' }));
  });

  afterEach(() => {
    UserService.get.restore();
  });

  it('works with a userId', () => {
    const result = defaultReducer({ userId: 'myUserId' });

    expect(result).to.deep.include({ userId: 'adminId' });
    expect(UserService.get.firstCall.args[0]).to.deep.equal('myUserId');
  });

  it('returns the assignedEmployee if assignedEmployeeId is found', () => {
    const result = defaultReducer({ assignedEmployeeId: 'assignee' });

    expect(result).to.deep.include({ userId: 'assignee' });
    expect(UserService.get.lastCall.args[0]).to.deep.equal('assignee');
  });

  it("returns the promotion's first user", () => {
    const result = defaultReducer({
      promotion: { userLinks: [{ _id: 'test2' }] },
    });

    expect(UserService.get.firstCall.args[0]).to.deep.equal('test2');
    expect(result).to.deep.include({ userId: 'adminId' });
  });

  it("returns the promotions' first user", () => {
    const result = defaultReducer({
      promotions: [{ userLinks: [{ _id: 'test2' }] }],
    });

    expect(UserService.get.firstCall.args[0]).to.deep.equal('test2');
    expect(result).to.deep.include({ userId: 'adminId' });
  });

  it('works with a custom function', () => {
    const reducer = assigneeReducer({}, ({ data }) => data.someId).assignee
      .reduce;

    const result = reducer({
      data: { someId: 'dude' },
    });

    expect(UserService.get.firstCall.args[0]).to.deep.equal('dude');
    expect(result).to.deep.include({ userId: 'adminId' });
  });
});
