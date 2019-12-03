// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import { ddpWithUserId } from 'core/api/methods/server/methodHelpers';
import generator from 'core/api/factories/index';
import { checkEmails } from '../../../../utils/testHelpers';
import LenderService from '../../../lenders/server/LenderService';
import { EMAIL_TEMPLATES, EMAIL_IDS } from '../../../email/emailConstants';
import OfferService from '../OfferService';
import { offerSendFeedback } from '../../methodDefinitions';

describe('OfferService', () => {
  let offer;
  let offerId;

  beforeEach(() => {
    resetDatabase();
  });

  describe('update', () => {
    it('modifies an offer', () => {
      offer = Factory.create('offer', { interest10: 0.05, loanId: 'loanId' });
      offerId = offer._id;
      expect(offer.interest10).to.equal(0.05);

      OfferService.update({ offerId, object: { interest10: 0.1 } });
      offer = OfferService.findOne(offerId);

      expect(offer.interest10).to.equal(0.1);
    });
  });

  describe('insert', () => {
    it('inserts an offer', () => {
      const lenderId = Factory.create('lender')._id;
      offerId = OfferService.insert({
        offer: {
          lenderId,
          maxAmount: 800000,
          amortizationGoal: 0.65,
        },
      });
      offer = OfferService.findOne(offerId);

      expect(offer.createdAt).to.not.equal(undefined);
    });

    it('rounds interestRates', () => {
      const lenderId = Factory.create('lender')._id;
      offerId = OfferService.insert({
        offer: {
          lenderId,
          maxAmount: 800000,
          amortizationGoal: 0.65,
          interest1: 0.01234,
        },
      });

      expect(OfferService.findOne(offerId).interest1).to.equal(0.0123);
    });
  });

  describe('remove', () => {
    it('removes an offer', () => {
      offer = Factory.create('offer', { interest10: 1 });
      offerId = offer._id;

      OfferService.remove({ offerId });
      offer = OfferService.findOne(offerId);

      expect(offer).to.equal(undefined);
    });
  });

  describe('send feedback', function () {
    this.timeout(10000);

    it('sends the feedback to the lender', async () => {
      generator({
        users: {
          _id: 'userId',
          assignedEmployee: {
            _id: 'adminId',
            _factory: 'admin',
            firstName: 'Dev',
            lastName: 'e-Potek',
            emails: [{ address: 'dev@e-potek.ch', verified: true }],
          },
          loans: {
            _id: 'loanId',
            lenders: {
              _id: 'lenderId',
              organisation: { _id: 'orgId' },
              contact: {
                emails: [{ address: 'john@doe.com' }],
                firstName: 'John',
                lastName: 'Doe',
                organisations: { _id: 'orgId' },
              },
            },
          },
        },
      });
      offerId = OfferService.insert({
        offer: {
          interest10: 1,
          maxAmount: 1000000,
          lenderId: 'lenderId',
        },
      });

      const feedback = 'This is my feedback';

      await ddpWithUserId('adminId', () =>
        offerSendFeedback.run({ offerId, feedback }),
      );

      const [
        {
          emailId,
          address,
          response: { status },
          template: {
            template_name,
            message: {
              from_email,
              subject,
              global_merge_vars,
              from_name,
              bcc_address,
            },
          },
        },
      ] = await checkEmails(1);

      expect(status).to.equal('sent');
      expect(emailId).to.equal(EMAIL_IDS.SEND_FEEDBACK_TO_LENDER);
      expect(template_name).to.equal(EMAIL_TEMPLATES.SIMPLE.mandrillId);
      expect(address).to.equal('john@doe.com');
      expect(from_email).to.equal('dev@e-potek.ch');
      expect(bcc_address).to.equal('dev@e-potek.ch');
      expect(from_name).to.equal('Dev E-Potek');
      expect(subject).to.include('Feedback client sur');
      expect(
        global_merge_vars.find(({ name }) => name === 'BODY').content,
      ).to.include(feedback);
    });
  });
});
