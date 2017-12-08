/* eslint-env mocha */
import { expect } from 'chai';

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import sinon from 'sinon';
import { stubCollections } from '/imports/js/helpers/testHelpers';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import {
  getEmailContent,
  defaultCTA_URL,
  defaultFrom,
} from '../email-defaults';

describe('emails', () => {
  let user;

  describe('getEmailContent', () => {
    beforeEach(() => {
      resetDatabase();
      stubCollections();
      user = Factory.create('user');
      sinon.stub(Meteor, 'user').callsFake(() => user);
      sinon.stub(Meteor, 'userId').callsFake(() => user._id);
    });

    afterEach(() => {
      Meteor.user.restore();
      Meteor.userId.restore();
      stubCollections.restore();
    });

    it('returns a valid email string for each existing email', () => {
      const emails = [
        'auctionStarted',
        'auctionEnded',
        'resetPassword',
        'verificationError',
        'verificationPassed',
        'verificationRequested',
      ];

      const intlValues = {
        date: new Date(),
      };

      emails.forEach((emailId) => {
        const content = getEmailContent(emailId, intlValues);

        Object.keys(content).forEach((key) => {
          expect(typeof content[key]).to.equal('string');
          expect(content[key], `${emailId} ${key}`).to.have.length.above(0);
        });
      });
    });

    it("returns the currently logged in user's email", () => {
      expect(getEmailContent('testId').email).to.equal(user.emails[0].address);
    });

    it('returns the defaultCTA_URL if no CTA is specified for the email', () => {
      expect(getEmailContent('testId').CTA).to.equal(defaultCTA_URL);
    });

    it('returns the default from value if none is specified', () => {
      expect(getEmailContent('testId').from).to.equal(defaultFrom);
    });
  });
});
