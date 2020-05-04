import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';

/* eslint-env mocha */
import { expect } from 'chai';

import { checkEmails } from '../../../../utils/testHelpers';
import { EMAIL_IDS, EMAIL_TEMPLATES } from '../../../email/emailConstants';
import generator from '../../../factories/server';
import { ddpWithUserId } from '../../../methods/methodHelpers';
import { offerSendFeedback } from '../../methodDefinitions';
import OfferService from '../OfferService';

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
      offer = OfferService.get(offerId, { interest10: 1 });

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
      offer = OfferService.get(offerId, { createdAt: 1 });

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

      expect(OfferService.get(offerId, { interest1: 1 }).interest1).to.equal(
        0.0123,
      );
    });
  });

  describe('remove', () => {
    it('removes an offer', () => {
      offer = Factory.create('offer', { interest10: 1 });
      offerId = offer._id;

      OfferService.remove({ offerId });
      offer = OfferService.get(offerId, { _id: 1 });

      expect(offer).to.equal(undefined);
    });
  });

  describe('send feedback', function() {
    this.timeout(10000);

    it('sends the feedback to the lender ', async () => {
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
                emails: [{ address: 'lender@e-potek.com' }],
                firstName: 'John',
                lastName: 'Doe',
                organisations: { _id: 'orgId' },
              },
            },
            assignees: { _id: 'adminId', $metadata: { isMain: true } },
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

      const result = await checkEmails(1);
      const [
        {
          emailId,
          address,
          response: { status },
          template: {
            template_name,
            message: { from_email, subject, global_merge_vars, from_name, to },
          },
        },
      ] = result;

      const bcc = to.find(({ email }) => email === 'dev@e-potek.ch', 'yoo');

      expect(status).to.equal('sent');
      expect(emailId).to.equal(EMAIL_IDS.SEND_FEEDBACK_TO_LENDER);
      expect(template_name).to.equal(EMAIL_TEMPLATES.SIMPLE.mandrillId);
      expect(address).to.equal('lender@e-potek.com');
      expect(from_email).to.equal('dev@e-potek.ch', 'dawg');
      expect(bcc.type).to.equal('bcc');
      expect(from_name).to.equal('Dev E-Potek');
      expect(subject).to.include('Feedback client sur');
      expect(
        global_merge_vars.find(({ name }) => name === 'BODY').content,
      ).to.include(feedback);
    });
  });
});
