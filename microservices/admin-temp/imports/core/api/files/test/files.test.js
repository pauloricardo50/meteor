/* eslint-env mocha */
import { expect } from 'chai';

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import sinon from 'sinon';
import { stubCollections } from 'core/utils/testHelpers';
import LoanRequests from 'core/api/loanrequests/loanrequests';
import Borrowers from 'core/api/borrowers/borrowers';
import AWS from 'aws-sdk';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { isAllowed } from '../fileMethods';

describe('files', () => {
  describe('isAllowed', () => {
    let userId;
    let user;

    beforeEach(() => {
      resetDatabase();
      stubCollections();
      user = Factory.create('user');
      userId = user._id;
      sinon.stub(Meteor, 'user').callsFake(() => user);
      sinon.stub(Meteor, 'userId').callsFake(() => userId);
    });

    afterEach(() => {
      stubCollections.restore();
      Meteor.user.restore();
      Meteor.userId.restore();
    });

    it('should return true if the user is dev', () => {
      Meteor.users.update(userId, { $set: { roles: 'dev' } });

      expect(isAllowed('')).to.equal(true);
    });

    it('should return true if the user is admin', () => {
      Meteor.users.update(userId, { $set: { roles: 'admin' } });

      expect(isAllowed('')).to.equal(true);
    });

    it('should throw if no loanRequest or borrower is associated to this account', () => {
      expect(() => isAllowed('')).to.throw('unauthorized');
    });

    it('should return true if this user has a loanRequest', () => {
      const request = Factory.create('loanRequest', { userId });

      expect(isAllowed(`${request._id}/`)).to.equal(true);
      LoanRequests.remove(request._id);
    });

    it('should return true if this user has a borrower', () => {
      const borrower = Factory.create('borrower', { userId });

      expect(isAllowed(`${borrower._id}/`)).to.equal(true);
      Borrowers.remove(borrower._id);
    });
  });

  describe('deleteFile', () => {
    const callbackResult = 'this is the result!';
    let user;

    beforeEach(() => {
      resetDatabase();
      stubCollections();
      user = Factory.create('admin');
      sinon.stub(AWS, 'S3').callsFake(() => ({
        deleteObject: (params, callback) => callback(undefined, callbackResult),
      }));
      sinon.stub(AWS.config, 'update').callsFake(() => {});
      sinon.stub(Meteor, 'userId').callsFake(() => user._id);
    });

    afterEach(() => {
      stubCollections.restore();
      AWS.S3.restore();
      AWS.config.update.restore();
      Meteor.userId.restore();
    });

    // it('calls deleteObject with a params object', (done) => {
    //   Meteor.call('deleteFile', '', (err, result) => {
    //     if (err) {
    //       done(err);
    //     }
    //
    //     expect(result).to.equal(callbackResult);
    //     done();
    //   });
    // });
  });
});
