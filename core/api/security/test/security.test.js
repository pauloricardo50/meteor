/* eslint-env mocha */
import { expect } from 'chai';
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import sinon from 'sinon';

import { stubCollections } from 'core/utils/testHelpers';

import SecurityService, { SECURITY_ERROR } from '..';

describe('Security service', () => {
  let userId;
  let devId;

  beforeEach(() => {
    resetDatabase();
    stubCollections();
    userId = Factory.create('user');
    devId = Factory.create('dev');
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
});
