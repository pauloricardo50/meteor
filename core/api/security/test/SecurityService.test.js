/* eslint-env mocha */
import { expect } from 'chai';
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import sinon from 'sinon';

import { stubCollections } from 'core/utils/testHelpers';

import SecurityService, { SECURITY_ERROR } from '..';
import { LoanSecurity } from '../collections';

describe('Security service', () => {
  let userId;
  let devId;

  beforeEach(() => {
    resetDatabase();
    stubCollections();
    userId = Factory.create('user')._id;
    devId = Factory.create('dev')._id;
    sinon.stub(Meteor, 'userId').callsFake(() => userId);
  });

  afterEach(() => {
    stubCollections.restore();
    Meteor.userId.restore();
  });

  describe('checkRole', () => {
    it('should throw if the user does not have the role', () => {
      expect(() =>
        SecurityService.checkRole(userId, 'incorrect-role')).to.throw(SECURITY_ERROR);
    });

    it('should not do anything if the user has the right role', () => {
      SecurityService.checkRole(userId, 'user');
    });

    it('should throw if no userId was passed', () => {
      expect(() =>
        SecurityService.checkRole(undefined, 'incorrect-role')).to.throw(SECURITY_ERROR);
      expect(() => SecurityService.checkRole(null, 'incorrect-role')).to.throw(SECURITY_ERROR);
    });

    it('should throw if an inexistent userId was given', () => {
      expect(() => SecurityService.checkRole('invalid-id', 'user')).to.throw(SECURITY_ERROR);
      expect(() => SecurityService.checkRole(123, 'user')).to.throw(SECURITY_ERROR);
      expect(() => SecurityService.checkRole({}, 'user')).to.throw(SECURITY_ERROR);
      expect(() => SecurityService.checkRole(() => {}, 'user')).to.throw(SECURITY_ERROR);
    });
  });

  describe('checkLoggedIn', () => {
    it('should not do anything if the user is logged in', () => {
      SecurityService.checkLoggedIn();
    });

    it('should throw if the user is not logged in', () => {
      Meteor.userId.restore();
      sinon.stub(Meteor, 'userId').callsFake(() => undefined);

      expect(() => SecurityService.checkLoggedIn()).to.throw(SECURITY_ERROR);
    });
  });

  describe('checkOwnership', () => {
    let loan;

    beforeEach(() => {
      loan = Factory.create('loan', { userId });
    });

    it('should not do anything if ownership is correct', () => {
      SecurityService.checkOwnership(loan);
    });

    it('should throw if ownership is incorrect', () => {
      Meteor.userId.restore();
      sinon.stub(Meteor, 'userId').callsFake(() => devId);
      expect(() => SecurityService.checkOwnership(loan)).to.throw(SECURITY_ERROR);
    });
  });

  describe('collection security getters', () => {
    it('loans should return LoanSecurity', () => {
      expect(SecurityService.loans).to.equal(LoanSecurity);
    });
  });
});
