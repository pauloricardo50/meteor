/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { stubCollections } from '/imports/js/helpers/testHelpers';
import sinon from 'sinon';

import Offers from '../offers';

import {
  insertOffer,
  insertAdminOffer,
  updateOffer,
  insertFakeOffer,
  deleteOffer,
} from '../methods';

describe('Offers', () => {
  let user;
  let userId;

  beforeEach(() => {
    stubCollections();
    user = Factory.create('partner');
    userId = user._id;
    sinon.stub(Meteor, 'userId').callsFake(() => userId);
    sinon.stub(Meteor, 'user').callsFake(() => user);
  });

  afterEach(() => {
    stubCollections.restore();
    Meteor.userId.restore();
    Meteor.user.restore();
  });

  describe('methods', () => {
    describe('insertOffer', () => {
      it('inserts an offer', (done) => {
        const object = Factory.build('offer');
        const request = Factory.create('loanRequest');
        object.requestId = request._id;
        object.userId = userId;

        const offerId = insertOffer.call({ object }, (err, result) => {
          if (err) {
            done(err);
          }
          const offer = Offers.findOne(result);
          expect(typeof offer).to.equal('object');
          expect(offer.userId).to.equal(object.userId);
          done();
        });
      });

      it('reads from the user and the request when inserting', () => {
        const date = new Date();
        const request = Factory.create('loanRequest', {
          logic: { auction: { endTime: date } },
        });
        user = Factory.create('partner', {
          profile: { organization: 'testOrganization', cantons: ['ZH'] },
          requestId: request._id,
        });
        userId = user._id;
        const object = Factory.build('offer', { requestId: request._id });
        const offerId = insertOffer.call({ object });
        const offer = Offers.findOne(offerId);

        expect(offer.userId).to.equal(user._id);
        expect(offer.organization).to.equal('testOrganization');
        expect(offer.canton).to.equal('ZH');
        expect(offer.auctionEndTime).to.deep.equal(date);
      });
    });

    describe('modifiers', () => {
      let offerId;
      let requestId;

      beforeEach(() => {
        requestId = Factory.create('loanRequest', { userId })._id;
        offerId = Factory.create('offer', { userId, requestId })._id;
      });

      describe('updateOffer', () => {
        it('works', () => {
          let offer = Offers.findOne(offerId);
          expect(offer.organization).to.equal('bankName');

          updateOffer.call({
            id: offerId,
            object: { organization: 'testOrganization' },
          });

          offer = Offers.findOne(offerId);
          expect(offer.organization).to.equal('testOrganization');
        });
      });
    });
  });
});
