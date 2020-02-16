/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { employeesByEmail } from 'core/arrays/epotekEmployees';
import LoanService from '../../../loans/server/LoanService';
import generator from '../../../factories/server';
import { up, down } from '../28';

describe('Migration 28', () => {
  beforeEach(() => resetDatabase());

  describe('up', () => {
    it('adds an adminNotes array if there is an adminNote', async () => {
      LoanService.rawInsert({ name: 'a' });
      LoanService.rawInsert({ name: 'b', adminNote: '' });
      LoanService.rawInsert({ name: 'c', adminNote: 'yo' });

      await up();

      const loans = LoanService.find({ adminNotes: { $exists: true } }).fetch();

      expect(loans.length).to.equal(1);
      expect(loans[0].adminNotes.length).to.equal(1);
      expect(loans[0].adminNotes[0].note).to.equal('yo');
    });

    it('adds 2 adminNotes if there was a newLine', async () => {
      LoanService.rawInsert({ name: 'a', adminNote: 'yo\ndude' });

      await up();

      const loan = LoanService.findOne({});

      expect(loan.adminNotes.length).to.equal(2);
      expect(loan.adminNotes[0].note).to.equal('yo');
      expect(loan.adminNotes[1].note).to.equal('dude');
    });

    it('adds 2 adminNotes even with multiple newlines', async () => {
      LoanService.rawInsert({ name: 'a', adminNote: 'yo\ndude\nhey' });

      await up();

      const loan = LoanService.findOne({});

      expect(loan.adminNotes.length).to.equal(2);
      expect(loan.adminNotes[0].note).to.equal('yo');
      expect(loan.adminNotes[1].note).to.equal('dude\nhey');
    });

    it('sets the user as the assignee', async () => {
      generator({
        users: { _id: 'user1', assignedEmployee: { _id: 'admin1' } },});
      LoanService.rawInsert({
        name: 'a',
        adminNote: 'yo',
        userId: 'user1',
      });

      await up();

      const loan = LoanService.findOne({});
      expect(loan.adminNotes[0].updatedBy).to.equal('admin1');
    });

    it('sets the user as yannis if there is no user', async () => {
      LoanService.rawInsert({ name: 'a', adminNote: 'yo' });

      await up();

      const loan = LoanService.findOne({});
      expect(loan.adminNotes[0].updatedBy).to.equal(
        employeesByEmail['yannis@e-potek.ch']._id,
      );
    });

    it('sets the user as yannis if there is no assignee', async () => {
      generator({ users: { _id: 'user1' } });
      LoanService.rawInsert({
        name: 'a',
        adminNote: 'yo',
        userId: 'user1',
      });

      await up();

      const loan = LoanService.findOne({});
      expect(loan.adminNotes[0].updatedBy).to.equal(
        employeesByEmail['yannis@e-potek.ch']._id,
      );
    });
  });

  describe('down', () => {
    it('removes the adminNotes array', async () => {
      generator({
        loans: {
          adminNotes: [{ note: 'yo', id: 'asdf', updatedBy: 'userId' }],
        },
      });

      await down();

      const loan = LoanService.findOne({});

      expect(loan.adminNote).to.equal('yo');
    });

    it('does not add a note if there were none', async () => {
      generator({ loans: { adminNotes: [] } });

      await down();

      const loan = LoanService.findOne({});

      expect(loan.adminNote).to.equal(undefined);
    });

    it('concatenates multiple notes', async () => {
      generator({
        loans: {
          adminNotes: [
            { note: 'yo', id: 'asdf1', updatedBy: 'userId' },
            { note: 'mah', id: 'asdf2', updatedBy: 'userId' },
            { note: 'dude', id: 'asdf3', updatedBy: 'userId' },
          ],
        },
      });

      await down();

      const loan = LoanService.findOne({});

      expect(loan.adminNote).to.equal('yo\nmah\ndude');
    });
  });
});
