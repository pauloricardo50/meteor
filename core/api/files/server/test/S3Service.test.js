/* eslint-env mocha */
import { expect } from 'chai';

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import sinon from 'sinon';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import Loans from 'core/api/loans/loans';
import Borrowers from 'core/api/borrowers/borrowers';
import S3Service from '../S3Service';

const clearBucket = () =>
  S3Service.listObjects('')
    .then(results => results.map(result => result.Key))
    .then(S3Service.deleteObjects);

describe('S3Service', () => {
  describe.only('API', () => {
    let json;
    let binaryData;
    let key;

    beforeEach(() => {
      json = { hello: 'world' };
      binaryData = Buffer.from(JSON.stringify(json), 'utf-8');
      key = 'test/hello.json';

      return clearBucket();
    });

    describe('putObject', () => {
      it('puts an object without failing', () =>
        S3Service.putObject(binaryData, key).then(result =>
          expect(result).to.not.equal(undefined)));
    });

    describe('deleteObject', () => {
      it('deletes an object without failing', () =>
        S3Service.putObject(binaryData, key)
          .then(() => S3Service.getObject(key))
          .then(result => expect(result).to.not.equal(undefined))
          .catch(err => expect(err).to.equal(undefined))
          .then(() => S3Service.deleteObject(key))
          .then(() => S3Service.getObject(key))
          .catch(err => expect(err.name).to.equal('NoSuchKey')));

      it('throws if you try to delete an unexisting object', () => {
        key = 'someKey.txt';
        return S3Service.deleteObject(key).catch((err) => {
          expect(err.name).to.equal('NoSuchKey');
        });
      });
    });

    describe('getObject', () => {
      it('gets an object if it exists', () =>
        S3Service.putObject(binaryData, key)
          .then(() => S3Service.getObject(key))
          .then(result =>
            expect(JSON.parse(result.Body.toString())).to.deep.equal(json)));

      it('returns an error if the object does not exist', () =>
        S3Service.getObject(key).catch(err =>
          expect(err.name).to.equal('NoSuchKey')));
    });

    describe('listObjects', () => {
      it('returns an empty array if no objects exist at that key', () => {
        key = 'root.json';

        return S3Service.putObject(binaryData, key)
          .then(() => S3Service.listObjects('emptyPrefix'))
          .then(results => expect(results).to.deep.equal([]));
      });

      it('returns all objects under a certain prefix', () => {
        const key1 = 'asdf/root1.json';
        const key2 = 'asdf/root2.json';

        return Promise.all([
          S3Service.putObject(binaryData, key1),
          S3Service.putObject(binaryData, key2),
        ])
          .then(() => S3Service.listObjects('asdf'))
          .then(results =>
            expect(results.map(({ Key }) => Key)).to.deep.equal([key1, key2]));
      });
    });

    describe('updateMetadata', () => {
      it('sets metadata if none existed before', () => {
        const metadata2 = { status: 'final' };

        return S3Service.putObject(binaryData, key)
          .then(() => S3Service.updateMetadata(key, metadata2))
          .then(() => S3Service.getObject(key))
          .then(({ Metadata }) => expect(Metadata).to.deep.equal(metadata2));
      });

      it('updates metadata on an existing object', () => {
        const metadata1 = { status: 'initial', hello: 'world' };
        const metadata2 = { status: 'final' };

        return S3Service.putObject(binaryData, key, metadata1)
          .then(() => S3Service.getObject(key))
          .then(({ Metadata }) => expect(Metadata).to.deep.equal(metadata1))
          .then(() => S3Service.updateMetadata(key, metadata2))
          .then(() => S3Service.getObject(key))
          .then(({ Metadata }) =>
            expect(Metadata).to.deep.equal({ ...metadata1, ...metadata2 }));
      });

      it('removes the temp object at the end', () => {
        const metadata2 = { status: 'final' };

        return S3Service.putObject(binaryData, key)
          .then(() => S3Service.updateMetadata(key, metadata2))
          .then(() => S3Service.listObjects(key))
          .then(results => expect(results.length).to.equal(1));
      });
    });
  });

  describe('isAllowed', () => {
    let userId;
    let user;

    beforeEach(() => {
      resetDatabase();
      user = Factory.create('user');
      userId = user._id;
      sinon.stub(Meteor, 'user').callsFake(() => user);
      sinon.stub(Meteor, 'userId').callsFake(() => userId);
    });

    afterEach(() => {
      Meteor.user.restore();
      Meteor.userId.restore();
    });

    it('should return true if the user is dev', () => {
      Meteor.users.update(userId, { $set: { roles: ['dev'] } });

      expect(S3Service.isAllowed('')).to.equal(true);
    });

    it('should return true if the user is admin', () => {
      Meteor.users.update(userId, { $set: { roles: 'admin' } });

      expect(S3Service.isAllowed('')).to.equal(true);
    });

    it('should throw if no loan or borrower is associated to this account', () => {
      expect(() => S3Service.isAllowed('')).to.throw('unauthorized');
    });

    it('should return true if this user has a loan', () => {
      const loan = Factory.create('loan', { userId });

      expect(S3Service.isAllowed(`${loan._id}/`)).to.equal(true);
      Loans.remove(loan._id);
    });

    it('should return true if this user has a borrower', () => {
      const borrower = Factory.create('borrower', { userId });

      expect(S3Service.isAllowed(`${borrower._id}/`)).to.equal(true);
      Borrowers.remove(borrower._id);
    });
  });
});
