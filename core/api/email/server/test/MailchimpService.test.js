/* eslint-env mocha */
import { expect } from 'chai';

import MailchimpService from '../MailchimpService';

describe.only('MailchimpService', () => {
  it('handles errors', async () => {
    try {
      await MailchimpService.testError();
      expect(2).to.equal(1);
    } catch (error) {
      expect(error.message).to.include('Mailchimp');
      expect(error.message).to.include('404');
      expect(error.message).to.include('Invalid path');
    }
  });

  describe('members', () => {
    it('returns the current data for a member', async () => {
      const {
        status,
        merge_fields: { FNAME, LNAME },
      } = await MailchimpService.getMember({
        email: 'florian@e-potek.ch',
      });

      expect(status).to.equal('subscribed');
      expect(FNAME).to.equal('Florian');
      expect(LNAME).to.equal('Bienefelt');
    });

    it('updates a member', async () => {
      await MailchimpService.upsertMember({
        email: 'digital@e-potek.ch',
        firstName: 'Digital-test',
      });

      const {
        merge_fields: { FNAME: firstName1 },
      } = await MailchimpService.getMember({
        email: 'digital@e-potek.ch',
      });

      expect(firstName1).to.equal('Digital-test');

      await MailchimpService.upsertMember({
        email: 'digital@e-potek.ch',
        firstName: 'Digital-test-2',
      });

      const {
        merge_fields: { FNAME: firstName2 },
      } = await MailchimpService.getMember({
        email: 'digital@e-potek.ch',
      });

      expect(firstName2).to.equal('Digital-test-2');

      await MailchimpService.unsubscribeMember({
        email: 'digital@e-potek.ch',
      });

      const { status } = await MailchimpService.getMember({
        email: 'digital@e-potek.ch',
      });

      expect(status).to.equal('unsubscribed');
    });

    it.skip('archives them', () => {
      // Can't test this, as mailchimp won't let you archive and unarchive members
    });
  });

  describe('getLastCampaigns', () => {
    it('returns 3 campaigns sorted by send date', async () => {
      const result = await MailchimpService.getLastCampaigns();

      expect(result.length).to.equal(3);
      const isSorted = result.every(
        ({ send_time }, i) =>
          i === 0 ||
          Date.parse(send_time) <= Date.parse(result[i - 1].send_time),
      );
      expect(isSorted).to.equal(true);
    });
  });

  describe('listMergeFields', () => {
    it('returns the list of all merge fields in a list ', async () => {
      const result = await MailchimpService.listMergeFields();

      expect(result.length).to.equal(5);
      ['FNAME', 'LNAME', 'ORG', 'ADDRESS', 'PHONE'].every(t =>
        result.find(({ tag }) => t === tag),
      );
    });
  });
});
