/* eslint-env mocha */
import { expect } from 'chai';
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import sinon from 'sinon';

import { stubCollections } from 'core/utils/testHelpers';

import { SECURITY_ERROR } from '..';
import LoanSecurity from '../collections/LoanSecurity';

describe('LoanSecurity', () => {
  let userId;
  let userId2;
  let adminId;
  let devId;
  let loanId;

  beforeEach(() => {
    resetDatabase();
    stubCollections();
    userId = Factory.create('user')._id;
    userId2 = Factory.create('user')._id;
    adminId = Factory.create('admin')._id;
    devId = Factory.create('dev')._id;
    loanId = Factory.create('loan', { userId })._id;
    sinon.stub(Meteor, 'userId').callsFake(() => userId);
  });

  afterEach(() => {
    stubCollections.restore();
    Meteor.userId.restore();
  });

  describe('isAllowedToInsert', () => {
    it('should throw if the user is not logged in', () => {
      Meteor.userId.restore();
      sinon.stub(Meteor, 'userId').callsFake(() => undefined);

      expect(() => LoanSecurity.isAllowedToInsert()).to.throw(SECURITY_ERROR);
    });

    it('should not do anything if the user is logged in', () => {
      LoanSecurity.isAllowedToInsert();
    });
  });

  describe('isAllowedToUpdate', () => {
    it('should not do anything if the user is the owner', () => {
      expect(() => LoanSecurity.isAllowedToUpdate(loanId)).to.not.throw();
    });

    it('should not do anything if the user is an admin', () => {
      Meteor.userId.restore();
      sinon.stub(Meteor, 'userId').callsFake(() => adminId);

      expect(() => LoanSecurity.isAllowedToUpdate(loanId)).to.not.throw();
    });

    it('should not do anything if the user is a dev', () => {
      Meteor.userId.restore();
      sinon.stub(Meteor, 'userId').callsFake(() => devId);

      expect(() => LoanSecurity.isAllowedToUpdate(loanId)).to.not.throw();
    });

    it('should throw if the user is not the owner', () => {
      Meteor.userId.restore();
      sinon.stub(Meteor, 'userId').callsFake(() => userId2);

      expect(userId).to.not.equal(userId2);
      expect(() => LoanSecurity.isAllowedToUpdate(loanId)).to.throw(SECURITY_ERROR);
    });
  });
});
