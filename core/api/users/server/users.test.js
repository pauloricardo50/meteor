/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import { stubCollections } from '/imports/js/helpers/testHelpers';
import sinon from 'sinon';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { createPartner } from '../methods';

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

      it('finds an existing user', () => {
        expect(Meteor.call('doesUserExist', email)).to.equal(true);
      });

      it('works with an email containing another one', () => {
        email += 'a';
        expect(Meteor.call('doesUserExist', email)).to.equal(false);
      });

      it('works with a substring of a user', () => {
        email = email.slice(0, -1);
        expect(Meteor.call('doesUserExist', email)).to.equal(false);
      });

      it('works with totally different email', () => {
        const inexistentEmail = 'hello@world.com';
        expect(Meteor.call('doesUserExist', inexistentEmail)).to.equal(false);
      });
    });
  });
});
