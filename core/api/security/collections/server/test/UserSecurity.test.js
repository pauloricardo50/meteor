/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import sinon from 'sinon';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { ROLES } from '../../../../constants';
import { SECURITY_ERROR } from '../../../Security';
import SecurityService from '../../..';

describe('UserSecurity', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('isAllowedToInsertByRole', () => {
    const userRole = ROLES.USER;
    const adminRole = ROLES.ADMIN;
    const devRole = ROLES.DEV;
    const otherRole = 'OTHER';
    let admin;

    beforeEach(() => {
      admin = Factory.create('admin');
      sinon.stub(Meteor, 'userId').callsFake(() => admin._id);
    });

    afterEach(() => {
      if (Meteor.userId.restore) {
        Meteor.userId.restore();
      }
    });

    it('throws if no argument is provided', () => {
      expect(() => SecurityService.users.isAllowedToInsertByRole()).to.throw();
    });

    it('throws if no role is provided', () => {
      expect(() => SecurityService.users.isAllowedToInsertByRole({})).to.throw(SECURITY_ERROR);
    });

    it('throws if passed another role than the ones defined', () => {
      expect(() =>
        SecurityService.users.isAllowedToInsertByRole({ role: otherRole })).to.throw(SECURITY_ERROR);
    });

    it('throws if you try to add devs without dev privileges', () => {
      expect(() =>
        SecurityService.users.isAllowedToInsertByRole({ role: devRole })).to.throw(SECURITY_ERROR);
    });

    it('throws if you try to add admins without dev privileges', () => {
      expect(() =>
        SecurityService.users.isAllowedToInsertByRole({ role: adminRole })).to.throw(SECURITY_ERROR);
    });

    it('throws if you try to add users with user privileges', () => {
      const user = Factory.create('user')._id;
      Meteor.userId.restore();
      sinon.stub(Meteor, 'userId').callsFake(() => user._id);

      expect(() =>
        SecurityService.users.isAllowedToInsertByRole({ role: userRole })).to.throw(SECURITY_ERROR);
    });
  });
});
