/* eslint-env mocha */
import { expect } from 'chai';

import { resetDatabase } from '../../../../utils/testHelpers';
import generator from '../../../factories/server';
import { ROLES } from '../../roles/roleConstants';
import UserService from '../UserService';

const checkRoles = (roles, rolesToMatch) => {
  expect(roles.length).to.equal(rolesToMatch.length);
  Object.values(ROLES).forEach(role => {
    const roleShouldMatch = rolesToMatch.some(
      roleToMatch => roleToMatch === role,
    );
    expect(roles.some(({ _id }) => _id === role)).to.equal(roleShouldMatch);
  });
};

describe('roles', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('DEV should have ADMIN, PRO and USER roles', () => {
    const userId = UserService.createUser({
      options: { email: 'test@test.com', password: '12345678abc' },
      role: ROLES.DEV,
    });

    const { roles } = UserService.get(userId, { roles: 1 });

    expect(roles[0]._id).to.equal(ROLES.DEV);
    expect(roles.length).to.equal(4);
    checkRoles(roles, [ROLES.DEV, ROLES.ADMIN, ROLES.PRO, ROLES.USER]);
  });

  it('OBSERVER should have ADMIN, PRO and USER roles', () => {
    const userId = UserService.createUser({
      options: { email: 'test@test.com', password: '12345678abc' },
      role: ROLES.OBSERVER,
    });

    const { roles } = UserService.get(userId, { roles: 1 });

    expect(roles[0]._id).to.equal(ROLES.OBSERVER);
    expect(roles.length).to.equal(4);
    checkRoles(roles, [ROLES.OBSERVER, ROLES.ADMIN, ROLES.PRO, ROLES.USER]);
  });

  it('OBSERVER should have ADMIN, PRO and USER roles', () => {
    const userId = UserService.createUser({
      options: { email: 'test@test.com', password: '12345678abc' },
      role: ROLES.ADVISOR,
    });

    const { roles } = UserService.get(userId, { roles: 1 });

    expect(roles[0]._id).to.equal(ROLES.ADVISOR);
    expect(roles.length).to.equal(4);
    checkRoles(roles, [ROLES.ADVISOR, ROLES.ADMIN, ROLES.PRO, ROLES.USER]);
  });

  it('PRO should have USER roles', () => {
    const userId = UserService.createUser({
      options: { email: 'test@test.com', password: '12345678abc' },
      role: ROLES.PRO,
    });

    const { roles } = UserService.get(userId, { roles: 1 });

    expect(roles[0]._id).to.equal(ROLES.PRO);
    expect(roles.length).to.equal(2);
    checkRoles(roles, [ROLES.PRO, ROLES.USER]);
  });

  it('USER should only have USER roles', () => {
    const userId = UserService.createUser({
      options: { email: 'test@test.com', password: '12345678abc' },
    });

    const { roles } = UserService.get(userId, { roles: 1 });

    expect(roles[0]._id).to.equal(ROLES.USER);
    expect(roles.length).to.equal(1);
    checkRoles(roles, [ROLES.USER]);
  });

  describe('setRole', () => {
    it('changes the role of a user', () => {
      generator({ users: { _id: 'userId' } });
      const newRole = ROLES.DEV;
      const u1 = UserService.get('userId', { roles: 1 });
      expect(u1.roles.length).to.equal(1);
      expect(u1.roles[0]).to.deep.include({ _id: ROLES.USER });

      UserService.setRole({ userId: 'userId', role: newRole });

      const u2 = UserService.get('userId', { roles: 1 });
      expect(u2.roles[0]._id).to.equal(newRole);
    });

    it('throws if an unauthorized role is set', () => {
      const newRole = 'some random ass role';
      generator({ users: { _id: 'userId' } });

      expect(() =>
        UserService.setRole({ userId: 'userId', role: newRole }),
      ).to.throw(`'${newRole}' does not exist`);
    });

    it('throws if admin is set on its own', () => {
      generator({ users: { _id: 'userId' } });
      expect(() =>
        UserService.setRole({ userId: 'userId', role: ROLES.ADMIN }),
      ).to.throw(`Should not set ADMIN`);
    });

    it('should clear all roles and set new ones', () => {
      generator({ users: { _id: 'userId', _factory: ROLES.DEV } });

      UserService.setRole({ userId: 'userId', role: ROLES.PRO });

      const { roles } = UserService.get('userId', { roles: 1 });

      expect(roles[0]._id).to.equal(ROLES.PRO);
      const pro = roles.find(({ _id }) => _id === ROLES.PRO);
      expect(pro.assigned).to.equal(true);
      checkRoles(roles, [ROLES.PRO, ROLES.USER]);
    });

    it('should upgrade all roles', () => {
      generator({ users: { _id: 'userId' } });

      UserService.setRole({ userId: 'userId', role: ROLES.OBSERVER });

      const { roles } = UserService.get('userId', { roles: 1 });

      const obs = roles.find(({ _id }) => _id === ROLES.OBSERVER);
      const user = roles.find(({ _id }) => _id === ROLES.USER);

      expect(roles[0]._id).to.equal(ROLES.OBSERVER);
      expect(obs.assigned).to.equal(true);
      expect(user.assigned).to.equal(false);
      checkRoles(roles, [ROLES.OBSERVER, ROLES.ADMIN, ROLES.PRO, ROLES.USER]);
    });
  });
});
