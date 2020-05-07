/* eslint-env mocha */
import { expect } from 'chai';

import { resetDatabase } from '../../../../utils/testHelpers';
import generator from '../../../factories/server';
import { ROLES } from '../../roles/roleConstants';
import UserService from '../UserService';

describe.only('roles', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('DEV should have ADMIN, PRO and USER roles', () => {
    const userId = UserService.createUser({
      options: { email: 'test@test.com', password: '12345678' },
      role: ROLES.DEV,
    });

    const { roles } = UserService.get(userId, { roles: 1 });

    expect(roles.length).to.equal(4);
    expect(roles.some(({ _id }) => _id === ROLES.ADVISOR)).to.equal(false);
    expect(roles.some(({ _id }) => _id === ROLES.OBSERVER)).to.equal(false);
    expect(roles.some(({ _id }) => _id === ROLES.DEV)).to.equal(true);
    expect(roles.some(({ _id }) => _id === ROLES.ADMIN)).to.equal(true);
    expect(roles.some(({ _id }) => _id === ROLES.PRO)).to.equal(true);
    expect(roles.some(({ _id }) => _id === ROLES.USER)).to.equal(true);
  });

  it('OBSERVER should have ADMIN, PRO and USER roles', () => {
    const userId = UserService.createUser({
      options: { email: 'test@test.com', password: '12345678' },
      role: ROLES.OBSERVER,
    });

    const { roles } = UserService.get(userId, { roles: 1 });

    expect(roles.length).to.equal(4);
    expect(roles.some(({ _id }) => _id === ROLES.DEV)).to.equal(false);
    expect(roles.some(({ _id }) => _id === ROLES.OBSERVER)).to.equal(true);
    expect(roles.some(({ _id }) => _id === ROLES.ADMIN)).to.equal(true);
    expect(roles.some(({ _id }) => _id === ROLES.PRO)).to.equal(true);
    expect(roles.some(({ _id }) => _id === ROLES.USER)).to.equal(true);
  });

  it('OBSERVER should have ADMIN, PRO and USER roles', () => {
    const userId = UserService.createUser({
      options: { email: 'test@test.com', password: '12345678' },
      role: ROLES.ADVISOR,
    });

    const { roles } = UserService.get(userId, { roles: 1 });

    expect(roles.length).to.equal(4);
    expect(roles.some(({ _id }) => _id === ROLES.DEV)).to.equal(false);
    expect(roles.some(({ _id }) => _id === ROLES.OBSERVER)).to.equal(false);
    expect(roles.some(({ _id }) => _id === ROLES.ADVISOR)).to.equal(true);
    expect(roles.some(({ _id }) => _id === ROLES.ADMIN)).to.equal(true);
    expect(roles.some(({ _id }) => _id === ROLES.PRO)).to.equal(true);
    expect(roles.some(({ _id }) => _id === ROLES.USER)).to.equal(true);
  });

  it('PRO should have USER roles', () => {
    const userId = UserService.createUser({
      options: { email: 'test@test.com', password: '12345678' },
      role: ROLES.PRO,
    });

    const { roles } = UserService.get(userId, { roles: 1 });

    expect(roles.length).to.equal(2);
    expect(roles.some(({ _id }) => _id === ROLES.DEV)).to.equal(false);
    expect(roles.some(({ _id }) => _id === ROLES.ADMIN)).to.equal(false);
    expect(roles.some(({ _id }) => _id === ROLES.PRO)).to.equal(true);
    expect(roles.some(({ _id }) => _id === ROLES.USER)).to.equal(true);
  });

  it('USER should only have USER roles', () => {
    const userId = UserService.createUser({
      options: { email: 'test@test.com', password: '12345678' },
    });

    const { roles } = UserService.get(userId, { roles: 1 });

    expect(roles.length).to.equal(1);
    expect(roles.some(({ _id }) => _id === ROLES.DEV)).to.equal(false);
    expect(roles.some(({ _id }) => _id === ROLES.ADMIN)).to.equal(false);
    expect(roles.some(({ _id }) => _id === ROLES.PRO)).to.equal(false);
    expect(roles.some(({ _id }) => _id === ROLES.USER)).to.equal(true);
  });

  describe('setRole', () => {
    it('should clear all roles and set new ones', () => {
      generator({ users: { _id: 'userId', _factory: ROLES.DEV } });

      UserService.setRole({ userId: 'userId', role: ROLES.PRO });

      const { roles } = UserService.get('userId', { roles: 1 });

      const pro = roles.find(({ _id }) => _id === ROLES.PRO);
      expect(pro.assigned).to.equal(true);
      expect(roles.some(({ _id }) => _id === ROLES.DEV)).to.equal(false);
      expect(roles.some(({ _id }) => _id === ROLES.ADMIN)).to.equal(false);
      expect(roles.some(({ _id }) => _id === ROLES.PRO)).to.equal(true);
      expect(roles.some(({ _id }) => _id === ROLES.USER)).to.equal(true);
    });

    it('should upgrade all roles', () => {
      generator({ users: { _id: 'userId' } });

      UserService.setRole({ userId: 'userId', role: ROLES.OBSERVER });

      const { roles } = UserService.get('userId', { roles: 1 });

      const obs = roles.find(({ _id }) => _id === ROLES.OBSERVER);
      const user = roles.find(({ _id }) => _id === ROLES.USER);

      expect(obs.assigned).to.equal(true);
      expect(user.assigned).to.equal(false);
      expect(roles.some(({ _id }) => _id === ROLES.DEV)).to.equal(false);
      expect(roles.some(({ _id }) => _id === ROLES.OBSERVER)).to.equal(true);
      expect(roles.some(({ _id }) => _id === ROLES.ADMIN)).to.equal(true);
      expect(roles.some(({ _id }) => _id === ROLES.PRO)).to.equal(true);
      expect(roles.some(({ _id }) => _id === ROLES.USER)).to.equal(true);
    });
  });
});
