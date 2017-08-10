/* eslint-env mocha */
import { expect } from 'chai';

import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import sinon from 'sinon';
import { stubCollections } from '/imports/js/helpers/testHelpers';
import StubCollections from 'meteor/hwillson:stub-collections';

import {
  getEmailContent,
  defaultCTA_URL,
  defaultFrom,
} from '../email-defaults';

import LoanRequests from '/imports/api/loanrequests/loanrequests';
import Borrowers from '/imports/api/borrowers/borrowers';
import Offers from '/imports/api/offers/offers';
import AdminActions from '/imports/api/adminActions/adminActions';
import Comparators from '/imports/api/comparators/comparators';
import Properties from '/imports/api/properties/properties';

// describe('test', () => {
//   before(() => {
//     StubCollections.add([
//       Meteor.users,
//       LoanRequests,
//       Borrowers,
//       Offers,
//       AdminActions,
//       Properties,
//       Comparators,
//     ]);
//     StubCollections.stub();
//     StubCollections.restore();
//     console.log('yep!');
//   });
//
//   it('works');
// });

describe('emails', () => {
  let user;

  describe('getEmailContent', () => {
    beforeEach((done) => {
      console.log('getEmails');

      const time = process.hrtime();
      // debugger;
      const t = [];
      const s = [];
      s[0] = process.hrtime();
      try {
        // debugger;
        // done();
        // return;
        StubCollections.stub([Meteor.users]);
      } catch (e) {
        done(e);
      }
      t[0] = process.hrtime(s[0]);
      s[1] = process.hrtime();

      user = Factory.create('user');
      t[1] = process.hrtime(s[1]);
      s[2] = process.hrtime();

      sinon.stub(Meteor, 'user').callsFake(() => user);
      sinon.stub(Meteor, 'userId').callsFake(() => user._id);
      t[2] = process.hrtime(s[2]);

      t.forEach((tim) => {
        console.log(`${tim[1] / 1000000} ms`);
      });

      console.log(`totalz: ${process.hrtime(time)[1] / 1000000} ms`);
      done();
    });

    afterEach(() => {
      console.log('5');
      Meteor.user.restore();
      Meteor.userId.restore();
      console.log('6');
      StubCollections.restore();
      console.log('7 ');
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

      console.log('testing!!');

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
