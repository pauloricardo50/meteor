/* eslint-env mocha */
import { expect } from 'chai';
import moment from 'moment';

import { resetDatabase } from 'core/utils/testHelpers';

import generator from '../../../factories/server';
import { ROLES } from '../../roles/roleConstants';
import { ASSIGNEE } from '../../userConstants';
import AssigneeService from '../AssigneeService';
import UserService from '../UserService';

describe('AssigneeService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('stores all advisors sorted by createdAt, to preserve the round-robin order', async () => {
    generator({
      users: [
        { _id: 'a', _factory: ROLES.ADVISOR },
        { _id: 'b', _factory: ROLES.ADVISOR },
        { _id: 'c', _factory: ROLES.ADVISOR },
        { _id: 'd', _factory: ROLES.ADVISOR },
        { _id: 'e', _factory: ROLES.OBSERVER },
      ],
    });
    await UserService.rawCollection.update(
      { _id: 'a' },
      {
        $set: {
          createdAt: moment()
            .subtract(1, 'days')
            .toDate(),
        },
      },
    );
    await UserService.rawCollection.update(
      { _id: 'b' },
      {
        $set: {
          createdAt: moment()
            .add(1, 'days')
            .toDate(),
        },
      },
    );
    await UserService.rawCollection.update(
      { _id: 'c' },
      {
        $set: {
          createdAt: moment()
            .subtract(2, 'days')
            .toDate(),
        },
      },
    );
    await UserService.rawCollection.update(
      { _id: 'd' },
      {
        $set: {
          createdAt: moment()
            .add(2, 'days')
            .toDate(),
        },
      },
    );

    const service = new AssigneeService();

    expect(service.advisors.length).to.equal(4);
    expect(service.advisors[0]._id).to.equal('c');
    expect(service.advisors[1]._id).to.equal('a');
    expect(service.advisors[2]._id).to.equal('b');
    expect(service.advisors[3]._id).to.equal('d');
  });

  it('creates a shortlist of advisors who are part of the round-robin', () => {
    generator({
      users: [
        { _factory: ROLES.ADVISOR },
        { _factory: ROLES.ADVISOR, isInRoundRobin: false },
        { _factory: ROLES.ADVISOR },
      ],
    });

    const service = new AssigneeService();
    expect(service.advisors.length).to.equal(3);
    expect(service.roundRobinAdvisors.length).to.equal(2);
  });

  describe('isAvailable', () => {
    it('returns true if an advisor is available', () => {
      generator({ users: { _id: 'admin', _factory: ROLES.ADVISOR } });
      const service = new AssigneeService();
      expect(service.isAvailable('admin')).to.equal(true);
    });

    it('returns false if an advisor has set his timeout', () => {
      generator({
        users: {
          _id: 'admin',
          _factory: ROLES.ADVISOR,
          roundRobinTimeout: 'Not around',
        },
      });
      const service = new AssigneeService();
      expect(service.isAvailable('admin')).to.equal(false);
    });

    it('returns true if the assignee is not an advisor', () => {
      generator({
        users: [
          { _id: 'advisor1', _factory: ROLES.ADVISOR },
          { _id: 'advisor2', _factory: ROLES.ADVISOR },
          { _id: 'dev1', _factory: ROLES.DEV },
        ],
      });
      const service = new AssigneeService();
      expect(service.isAvailable('dev1')).to.equal(true);
    });

    it('returns false if the _id is falsy', () => {
      generator({
        users: [
          { _id: 'advisor1', _factory: ROLES.ADVISOR },
          { _id: 'advisor2', _factory: ROLES.ADVISOR },
        ],
      });
      const service = new AssigneeService();
      expect(service.isAvailable('')).to.equal(false);
    });
  });

  describe('getSuggestedAssigneeId', () => {
    it('returns the promotion assigneeId as a priority', () => {
      generator({
        promotions: {
          assignedEmployee: { _id: 'advisor1', _factory: ROLES.ADVISOR },
          loans: {
            user: {
              _id: 'user',
              referredByUser: {
                assignedEmployee: { _id: 'advisor2', _factory: ROLES.ADVISOR },
              },
            },
          },
        },
      });

      const service = new AssigneeService('user');
      expect(service.getSuggestedAssigneeId()).to.equal('advisor1');
    });

    it("returns the assignee of the referring pro next, ignoring the organisation's assignee", () => {
      generator({
        users: [
          {
            _id: 'user',
            referredByUser: {
              assignedEmployee: { _id: 'advisor1', _factory: ROLES.ADVISOR },
            },
            referredByOrganisation: {
              assignee: { _id: 'advisor2', _factory: ROLES.ADVISOR },
            },
          },
        ],
      });

      const service = new AssigneeService('user');
      expect(service.getSuggestedAssigneeId()).to.equal('advisor1');
    });

    it("returns the assignee of the referring pro's main organisation, before the referring organisation", () => {
      generator({
        users: [
          {
            _id: 'user',
            referredByUser: {
              organisations: [
                {
                  assignee: { _id: 'advisor4', _factory: ROLES.ADVISOR },
                },
                {
                  $metadata: { isMain: true },
                  assignee: { _id: 'advisor3', _factory: ROLES.ADVISOR },
                },
              ],
            },
            referredByOrganisation: {
              assignee: { _id: 'advisor2', _factory: ROLES.ADVISOR },
            },
          },
        ],
      });

      const service = new AssigneeService('user');
      expect(service.getSuggestedAssigneeId()).to.equal('advisor3');
    });

    it('returns the assignee of the referredByOrganisation next', () => {
      generator({
        users: [
          { _id: 'advisor1', _factory: ROLES.ADVISOR },
          {
            _id: 'user',
            referredByUser: {},
            referredByOrganisation: {
              assignee: { _id: 'advisor2', _factory: ROLES.ADVISOR },
            },
          },
        ],
      });

      const service = new AssigneeService('user');
      expect(service.getSuggestedAssigneeId()).to.equal('advisor2');
    });

    it("cascades through advisors if they're unavailable", () => {
      generator({
        users: [
          {
            _id: 'user',
            referredByUser: {
              assignedEmployee: {
                _id: 'advisor4',
                _factory: ROLES.ADVISOR,
                roundRobinTimeout: 'Not here',
              },
              organisations: {
                $metadata: { isMain: true },
                assignee: {
                  _id: 'advisor3',
                  _factory: ROLES.ADVISOR,
                  roundRobinTimeout: 'Not here either',
                },
              },
            },
            referredByOrganisation: {
              assignee: { _id: 'advisor2', _factory: ROLES.ADVISOR },
            },
          },
        ],
      });

      const service = new AssigneeService('user');
      expect(service.getSuggestedAssigneeId()).to.equal('advisor2');
    });

    it('returns false if no suggestedAssignee was found', () => {
      generator({
        users: [
          { _id: 'advisor1', _factory: ROLES.ADVISOR },
          { _id: 'advisor2', _factory: ROLES.ADVISOR },
          { _id: 'user' },
        ],
      });

      const service = new AssigneeService('user');
      expect(service.getSuggestedAssigneeId()).to.equal(false);
    });
  });

  describe('round robin', () => {
    const employees = ['a@e-potek.ch', 'b@e-potek.ch', 'c@e-potek.ch'];

    beforeEach(() => {
      generator({
        users: employees.map(email => ({
          _id: email.slice(0, 1),
          _factory: ROLES.ADVISOR,
          emails: [{ address: email, verified: true }],
        })),
      });
    });

    it('sets the first user to the first in the array', () => {
      const newUserId = UserService.adminCreateUser({
        email: '1@e-potek.ch',
      });

      const { assignedEmployee } = UserService.get(newUserId, {
        assignedEmployee: { email: 1 },
      });

      expect(assignedEmployee.email).to.equal(employees[0]);
    });

    it('sets the second user to the second in the array', () => {
      UserService.adminCreateUser({
        email: '1@e-potek.ch',
      });

      const newUserId2 = UserService.adminCreateUser({
        email: '2@e-potek.ch',
      });

      const { assignedEmployee } = UserService.get(newUserId2, {
        assignedEmployee: { email: 1 },
      });

      expect(assignedEmployee.email).to.equal(employees[1]);
    });

    it('loops back to first in array', () => {
      generator({
        users: { assignedEmployeeId: 'c', _factory: 'user' },
      });

      const newUserId = UserService.adminCreateUser({
        email: '1@e-potek.ch',
      });

      const { assignedEmployee } = UserService.get(newUserId, {
        assignedEmployee: { email: 1 },
      });

      expect(assignedEmployee.email).to.equal(employees[0]);
    });

    it('ignores users assigned to people outside of employees list, and check latest one', () => {
      generator({
        users: [
          { assignedEmployeeId: 'c', _factory: 'user' },
          { assignedEmployeeId: 'c', _factory: 'user' },
          { assignedEmployeeId: 'c', _factory: 'user' },
          { assignedEmployeeId: 'b', _factory: 'user' },
          { assignedEmployee: { _id: 'adminId', _factory: 'admin' } },
        ],
      });

      const newUserId = UserService.adminCreateUser({
        email: '1@e-potek.ch',
      });

      const { assignedEmployee } = UserService.get(newUserId, {
        assignedEmployee: { email: 1 },
      });

      expect(assignedEmployee.email).to.equal(employees[2]);
    });

    it('skips advisors who have their roundRobinTimeout set', () => {
      UserService.baseUpdate('a', {
        $set: { roundRobinTimeout: 'On vacation' },
      });
      UserService.baseUpdate('b', {
        $set: { roundRobinTimeout: 'On vacation too' },
      });

      const newUserId = UserService.adminCreateUser({
        email: '1@e-potek.ch',
      });

      const { assignedEmployee } = UserService.get(newUserId, {
        assignedEmployee: { email: 1 },
      });

      expect(assignedEmployee.email).to.equal(employees[2]);
    });

    it('sets the first advisor as assignee if all are unavailable', () => {
      UserService.baseUpdate('a', {
        $set: { roundRobinTimeout: 'On vacation' },
      });
      UserService.baseUpdate('b', {
        $set: { roundRobinTimeout: 'On vacation too' },
      });
      UserService.baseUpdate('c', {
        $set: { roundRobinTimeout: 'On vacation too' },
      });

      const newUserId = UserService.adminCreateUser({
        email: '1@e-potek.ch',
      });

      const { assignedEmployee } = UserService.get(newUserId, {
        assignedEmployee: { email: 1 },
      });

      expect(assignedEmployee.email).to.equal(employees[0]);
    });

    it('sends pro referred users into the round-robin if needed', () => {
      generator({
        users: [
          {
            _id: 'pro',
            _factory: ROLES.PRO,
            assignedEmployee: {
              _id: 'd',
              _factory: ROLES.ADVISOR,
              roundRobinTimeout: 'Not around',
            },
          },
        ],
      });

      // Go to round-robin index 1
      UserService.adminCreateUser({
        email: '1@e-potek.ch',
      });

      // should be assigned to `d`
      const { userId: newUserId } = UserService.proInviteUser({
        user: { email: '2@e-potek.ch', proUserId: 'pro' },
      });

      const { assignedEmployee } = UserService.get(newUserId, {
        assignedEmployee: { email: 1 },
      });

      expect(assignedEmployee.email).to.equal(employees[1]);
    });
  });

  describe('setAssignee', () => {
    it('sets no assignee if NONE is passed', () => {
      generator({
        users: {
          _id: 'userId',
          referredByUser: { assignedEmployee: { _factory: ROLES.ADVISOR } },
        },
      });

      const service = new AssigneeService('userId');
      service.setAssignee(ASSIGNEE.NONE);
      const user = UserService.get('userId', { assignedEmployeeId: 1 });
      expect(user.assignedEmployeeId).to.equal(undefined);
    });

    it('does not throw if no userId is passed in the constructor', () => {
      generator({ users: { _factory: ROLES.ADVISOR } });
      const service = new AssigneeService();
      expect(() => service.setAssignee()).to.not.throw();
    });

    it('sets the assignees in the right order', () => {
      generator({
        users: [
          { _id: 'advisor1', _factory: ROLES.ADVISOR },
          {
            _id: 'userId',
            referredByUser: {
              assignedEmployee: { _id: 'advisor2', _factory: ROLES.ADVISOR },
            },
          },
        ],
      });

      const service = new AssigneeService('userId');
      service.setAssignee();
      const user = UserService.get('userId', { assignedEmployeeId: 1 });
      expect(user.assignedEmployeeId).to.equal('advisor2');
    });

    it('jumps to round robin if asked', () => {
      generator({
        users: [
          {
            _id: 'user1',
            assignedEmployee: { _id: 'advisor1', _factory: ROLES.ADVISOR },
          },
          { _id: 'advisor2', _factory: ROLES.ADVISOR },
          {
            _id: 'user2',
            referredByUser: {
              assignedEmployee: {
                _id: 'advisor3',
                _factory: ROLES.ADVISOR,
                isInRoundRobin: false,
              },
            },
          },
        ],
      });

      const service = new AssigneeService('user2');
      service.setAssignee(ASSIGNEE.ROUND_ROBIN);
      const user = UserService.get('user2', { assignedEmployeeId: 1 });
      expect(user.assignedEmployeeId).to.equal('advisor2');
    });
  });

  describe('assignAdminToUser', () => {
    it('assigns an admin to a user', () => {
      generator({ users: { _id: 'userId' } });
      const adminId = 'my dude';

      expect(UserService.findOne('userId').assignedEmployeeId).to.equal(
        undefined,
      );
      AssigneeService.assignAdminToUser({ userId: 'userId', adminId });
      expect(UserService.findOne('userId').assignedEmployeeId).to.equal(
        adminId,
      );
    });

    it('does not fail if adminId is undefined', () => {
      generator({ users: { _id: 'userId' } });
      const adminId = undefined;

      expect(UserService.findOne('userId').assignedEmployeeId).to.equal(
        undefined,
      );
      AssigneeService.assignAdminToUser({ userId: 'userId', adminId });
      expect(UserService.findOne('userId').assignedEmployeeId).to.equal(
        adminId,
      );
    });
  });
});
