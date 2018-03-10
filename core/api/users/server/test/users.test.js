/* eslint-env mocha */
import { expect } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import { stubCollections } from 'core/utils/testHelpers';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { doesUserExist } from '../../methodDefinitions';

describe('users', () => {
  beforeEach(() => {
    resetDatabase();
    stubCollections();
  });

  afterEach(() => {
    stubCollections.restore();
  });

  describe('methods', () => {
    describe('doesUserExist', () => {
      let email;

      beforeEach(() => {
        email = 'yep@yop.com';
        Factory.create('user', {
          emails: [{ address: email, verified: false }],
        });
      });

      it('finds an existing user', () =>
        doesUserExist.run({ email }).then((result) => {
          expect(result).to.equal(true);
        }));

      it('returns false with an email containing another one', () => {
        email += 'a';
        return doesUserExist.run({ email }).then((result) => {
          expect(result).to.equal(false);
        });
      });

      it('returns false with a substring of a user', () => {
        email = email.slice(0, -1);
        return doesUserExist.run({ email }).then((result) => {
          expect(result).to.equal(false);
        });
      });

      it('returns false with totally different email', () => {
        const inexistentEmail = 'hello@world.com';
        return doesUserExist.run({ email: inexistentEmail }).then((result) => {
          expect(result).to.equal(false);
        });
      });
    });
  });
});
