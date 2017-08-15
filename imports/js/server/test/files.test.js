/* eslint-env mocha */
import { expect } from 'chai';

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import sinon from 'sinon';
import { stubCollections } from '/imports/js/helpers/testHelpers';
import LoanRequests from '/imports/api/loanrequests/loanrequests';
import Borrowers from '/imports/api/borrowers/borrowers';
import AWS from 'aws-sdk';

import { isAllowed } from '../files.js';

describe('files', () => {
  describe('isAllowed', () => {
    let user;
    beforeEach(() => {
      stubCollections();
      user = Factory.create('user');
      sinon.stub(Meteor, 'user').callsFake(() => user);
      sinon.stub(Meteor, 'userId').callsFake(() => user._id);
    });

    afterEach(() => {
      stubCollections.restore();
      Meteor.user.restore();
      Meteor.userId.restore();
    });

    it('should return true if the user is dev', () => {
      Meteor.users.update(user._id, { $set: { roles: 'dev' } });

      expect(isAllowed('')).to.equal(true);
    });

    it('should return true if the user is admin', () => {
      Meteor.users.update(user._id, { $set: { roles: 'admin' } });

      expect(isAllowed('')).to.equal(true);
    });

    it('should throw if no loanRequest or borrower is associated to this account', () => {
      expect(() => isAllowed('')).to.throw('unauthorized');
    });

    it('should return true if this user has a loanRequest', () => {
      const request = Factory.create('loanRequest');
      LoanRequests.update(request._id, { $set: { userId: user._id } });

      expect(isAllowed(`${request._id}/`)).to.equal(true);
      LoanRequests.remove(request._id);
    });

    it('should return true if this user has a borrower', () => {
      const borrower = Factory.create('borrower');
      Borrowers.update(borrower._id, { $set: { userId: user._id } });

      expect(isAllowed(`${borrower._id}/`)).to.equal(true);
      Borrowers.remove(borrower._id);
    });
  });

  describe('deleteFile', () => {
    const callbackResult = 'this is the result!';
    let user;

    beforeEach(() => {
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

    it('calls deleteObject with a params object', (done) => {
      Meteor.call('deleteFile', '', (err, result) => {
        if (err) {
          done(err);
        }

        expect(result).to.equal(callbackResult);
        done();
      });
    });
  });
});
