/* eslint-env mocha */
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { expect } from 'chai';

import SlackService from '../SlackService';
import UserService from '../../../users/server/UserService';
import LoanService from '../../../loans/server/LoanService';
import { fullUser } from '../../../fragments';

const TEST_CHANNEL = 'test';

describe('SlackService', function() {
  this.timeout(10000);

  beforeEach(() => {
    resetDatabase();
  });

  it('should not throw from server', () =>
    SlackService.send({
      channel: TEST_CHANNEL,
      text: 'should not throw from server',
    }).catch(err => {
      expect(err).to.equal(undefined);
    }));

  describe('notifyOfUpload', () => {
    it('should not do anything if the user is not a USER', () => {
      const user = Factory.create('admin');

      expect(SlackService.notifyOfUpload({ currentUser: user })).to.equal(
        false,
      );
    });

    it('should send a notification to the right channel with proper text', () => {
      const yannis = Factory.create('admin', {
        emails: [{ address: 'yannis@e-potek.ch', verified: true }],
      });
      const userId = Factory.create('user', {
        firstName: 'John',
        lastName: 'Doe',
        assignedEmployeeId: yannis._id,
      })._id;
      const loanId1 = Factory.create('loan', { userId, name: '20-0001' })._id;
      const loanId2 = LoanService.fullLoanInsert({ userId });
      const user = UserService.get(userId, fullUser());

      return SlackService.notifyOfUpload({
        currentUser: user,
        fileName: 'file.pdf',
        docLabel: 'Taxes',
        loanId: loanId2,
      }).then(({ attachments, channel }) => {
        expect(attachments[0].title).to.equal(
          'Upload: file.pdf dans Taxes pour 20-0002.',
        );
        expect(attachments[0].text).to.equal(
          '*Progrès:* Emprunteurs `0.00%`, Documents: `0.00%`, Bien immo: `0.00%`',
        );
        expect(channel).to.equal('#clients_yannis');
      });
    });

    it('should send a shorter text version if no loanId is passed', () => {
      const userId = Factory.create('user', {
        firstName: 'John',
        lastName: 'Doe',
      })._id;
      const user = UserService.get(userId, fullUser());

      return SlackService.notifyOfUpload({
        currentUser: user,
        fileName: 'file.pdf',
        docLabel: 'Taxes',
      }).then(({ attachments }) => {
        expect(attachments[0].title).to.equal('Upload: file.pdf dans Taxes.');
      });
    });

    it('should send a promotion specific notification', () => {
      const userId = Factory.create('user', {
        firstName: 'John',
        lastName: 'Doe',
      })._id;
      const promotionId = Factory.create('promotion', { name: 'A Promotion' })
        ._id;
      const loanId = LoanService.fullLoanInsert({ userId });
      LoanService.addLink({
        id: loanId,
        linkName: 'promotions',
        linkId: promotionId,
      });
      const user = UserService.get(userId, fullUser());

      return SlackService.notifyOfUpload({
        currentUser: user,
        fileName: 'file.pdf',
        docLabel: 'Taxes',
        loanId,
      }).then(({ attachments }) => {
        expect(attachments[0].text).to.equal(
          '_Promotion: `A Promotion`_ *Progrès:* Emprunteurs `0.00%`, Documents: `0.00%`',
        );
      });
    });
  });
});
