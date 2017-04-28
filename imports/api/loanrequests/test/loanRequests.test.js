/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { expect, assert } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { Random } from 'meteor/random';
import LoanRequests from '../loanrequests';
import {
  insertRequest,
  updateRequest,
  startAuction,
  pushRequestValue,
  popRequestValue,
  incrementStep,
} from '../methods';

describe('loanRequests', () => {
  beforeEach(function () {
    if (Meteor.isServer) {
      resetDatabase();
    }
  });

  describe('mutators', function () {
    it('builds correctly from factory', function () {
      const request = Factory.create('loanRequest');

      assert.typeOf(request, 'object');
    });
  });

  describe('methods', () => {
    describe('insertRequest', () => {
      it('Properly inserts a minimal request', () => {
        const object = {
          general: { fortuneUsed: 10 },
          property: { value: 100 },
          borrowers: ['asd'],
        };
        const userId = 'asdf';

        const requestId = insertRequest.call({ object, userId });
        const request = LoanRequests.findOne({ _id: requestId });

        expect(typeof request).to.equal('object');
        expect(request.userId).to.equal(userId);
      });
    });

    describe('modifiers', () => {
      let request;
      beforeEach(() => {
        request = Factory.create('loanRequest');
      });

      describe('updateRequest', () => {
        it('Properly update a request', () => {
          const id = request._id;
          const object = { 'general.fortuneUsed': 300000 };
          updateRequest.call({ object, id });
          const modifiedRequest = LoanRequests.findOne({ _id: id });

          expect(modifiedRequest.general.fortuneUsed).to.equal(300000);
        });
      });

      describe('pushRequestValue', () => {
        it('Properly pushes a value to request', () => {
          const id = request._id;
          const object = { 'general.partnersToAvoid': 'Jack' };
          pushRequestValue.call({ object, id });
          const modifiedRequest = LoanRequests.findOne({ _id: id });
          const length = request.general.partnersToAvoid.length;

          expect(modifiedRequest.general.partnersToAvoid.length).to.equal(length + 1);
        });
      });

      describe('popRequestValue', () => {
        it('Properly pops a value from a request', () => {
          const id = request._id;
          const object = { 'general.partnersToAvoid': 1 };
          popRequestValue.call({ object, id });
          const modifiedRequest = LoanRequests.findOne({ _id: id });
          const length = request.general.partnersToAvoid.length;

          expect(modifiedRequest.general.partnersToAvoid.length).to.equal(length - 1);
        });
      });
    });
  });
});
