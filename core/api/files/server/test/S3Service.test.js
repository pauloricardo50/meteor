import { Meteor } from 'meteor/meteor';

/* eslint-env mocha */
import { expect } from 'chai';

import S3Service from '../S3Service';

export const clearBucket = () =>
  Meteor.isTest && S3Service.deleteObjectsWithPrefix('');

describe('S3Service', function() {
  this.timeout(10000);

  before(function() {
    if (Meteor.settings.public.microservice !== 'pro') {
      // When running these tests in parallel, it breaks tests
      this.parent.pending = true;
      this.skip();
    }
  });

  describe('API', () => {
    let json;
    let binaryData;
    let key;

    before(() => {
      // Safety check
      expect(S3Service.params.Bucket).to.equal('e-potek-test-bucket');
    });

    beforeEach(() => {
      json = { hello: 'world' };
      binaryData = Buffer.from(JSON.stringify(json), 'utf-8');
      key = 'test/hello.json';

      return clearBucket();
    });

    describe('putObject', () => {
      it('puts an object without failing', () =>
        S3Service.putObject(binaryData, key).then(result =>
          expect(result).to.not.equal(undefined),
        ));
    });

    describe('deleteObject', () => {
      it('deletes an object without failing', () =>
        S3Service.putObject(binaryData, key)
          .then(() => S3Service.getObject(key))
          .then(result => expect(result).to.not.equal(undefined))
          .then(() => S3Service.deleteObject(key))
          .catch(err => expect(err).to.equal(undefined))
          .then(() => S3Service.getObject(key))
          .catch(err => expect(err.name).to.equal('NoSuchKey')));

      it('throws if you try to delete an unexisting object', () => {
        key = 'someKey.txt';
        return S3Service.deleteObject(key).catch(err => {
          expect(err.name).to.equal('NoSuchKey');
        });
      });
    });

    describe('getObject', () => {
      it('gets an object if it exists', () =>
        S3Service.putObject(binaryData, key)
          .then(() => S3Service.getObject(key))
          .then(result =>
            expect(JSON.parse(result.Body.toString())).to.deep.equal(json),
          ));

      it('returns an error if the object does not exist', () =>
        S3Service.getObject(key).catch(err =>
          expect(err.name).to.equal('NoSuchKey'),
        ));
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
            expect(results.map(({ Key }) => Key)).to.deep.equal([key1, key2]),
          );
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
            expect(Metadata).to.deep.equal({ ...metadata1, ...metadata2 }),
          );
      });

      it('lowercases your metadata keys', () => {
        const metadata = { camelCase: 'Hello world' };

        return S3Service.putObject(binaryData, key)
          .then(() => S3Service.updateMetadata(key, metadata))
          .then(() => S3Service.getObject(key))
          .then(({ Metadata: { camelcase } }) =>
            expect(camelcase).to.deep.equal(metadata.camelCase),
          );
      });

      it('does not fail if you set the same metadata', () => {
        const metadata1 = { status: 'initial', hello: 'world' };
        const metadata2 = metadata1;

        return S3Service.putObject(binaryData, key, metadata1)
          .then(() => S3Service.getObject(key))
          .then(({ Metadata }) => expect(Metadata).to.deep.equal(metadata1))
          .then(() => S3Service.updateMetadata(key, metadata2))
          .then(() => S3Service.getObject(key))
          .then(({ Metadata }) => expect(Metadata).to.deep.equal(metadata1));
      });
    });

    describe('headObject', () => {
      it('gets the metadata of an object if it exists', () => {
        const metadata = { hello: 'ma dude' };
        return S3Service.putObject(binaryData, key, metadata)
          .then(() => S3Service.headObject(key))
          .then(({ Metadata }) => expect(Metadata).to.deep.equal(metadata));
      });

      it('returns an error if the object does not exist', () =>
        S3Service.headObject(key).catch(err =>
          expect(err.name).to.equal('NotFound'),
        ));
    });

    describe('listObjectsWithMetadata', () => {
      it('returns a list of objects with their metadata ', () => {
        const key1 = 'asdf/root1.json';
        const key2 = 'asdf/root2.json';
        const statuses = ['hello', 'dude'];

        return Promise.all([
          S3Service.putObject(binaryData, key1, { status: statuses[0] }),
          S3Service.putObject(binaryData, key2, { status: statuses[1] }),
        ])
          .then(() => S3Service.listObjectsWithMetadata('asdf'))
          .then(results => {
            results.forEach(({ status }, index) => {
              expect(status).to.equal(statuses[index]);
            });
          });
      });
    });
  });

  describe('makeSignedUrl', () => {
    it('should return a signed url', () => {
      expect(S3Service.makeSignedUrl('dude/file.pdf')).to.include(
        'dude/file.pdf',
      );
    });
  });
});
