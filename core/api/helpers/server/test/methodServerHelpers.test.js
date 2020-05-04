import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';

/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import { checkInsertUserId } from '../methodServerHelpers';

describe('methodServerHelpers', () => {
  describe('checkInsertUserId', () => {
    let userId;
    let user;
    let admin;
    let adminId;

    beforeEach(() => {
      resetDatabase();
      user = Factory.create('user');
      admin = Factory.create('admin');
      userId = user._id;
      adminId = admin._id;
      sinon.stub(Meteor, 'userId').callsFake(() => userId);
    });

    afterEach(() => {
      Meteor.userId.restore();
    });

    it('returns the logged in user if no argument is passed', () => {
      expect(checkInsertUserId()).to.equal(userId);
    });

    it('returns the first argument if the logged in user is an admin', () => {
      Meteor.userId.restore();
      sinon.stub(Meteor, 'userId').callsFake(() => adminId);
      const testUserId = 'test';
      expect(checkInsertUserId(testUserId)).to.equal(testUserId);
    });

    it('throws if a userId is passed and the logged in user is a role===user', () => {
      const testUserId = 'test';
      expect(() => checkInsertUserId(testUserId)).to.throw('NOT_AUTHORIZED');
    });

    it('throws if userId is falsy but not undefined', () => {
      expect(() => checkInsertUserId(false)).to.throw('NOT_AUTHORIZED');
      expect(() => checkInsertUserId(null)).to.throw('NOT_AUTHORIZED');
      expect(() => checkInsertUserId(0)).to.throw('NOT_AUTHORIZED');
    });
  });
});
