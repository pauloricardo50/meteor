import { resetDatabase } from 'meteor/xolvio:cleaner';

import { expect } from 'chai';

import generator from '../../../factories/server';
import InsuranceRequestService from '../InsuranceRequestService';

describe('InsuranceRequestService', () => {
  beforeEach(() => resetDatabase());

  describe('insert', () => {
    it('links the loan if given', () => {
      generator({ loans: { _id: 'loan' } });

      const irId = InsuranceRequestService.insert({ loanId: 'loan' });

      const ir = InsuranceRequestService.get(irId, { loan: { _id: 1 } });
      expect(ir.loan).to.deep.include({ _id: 'loan' });
    });

    it('links the user if given', () => {
      generator({
        users: {
          _id: 'user',
          assignedEmployee: { _id: 'admin', _factory: 'admin' },
        },
      });

      const irId = InsuranceRequestService.insert({ userId: 'user' });

      const ir = InsuranceRequestService.get(irId, { user: { _id: 1 } });
      expect(ir.user).to.deep.include({ _id: 'user' });
    });

    it('links the loan user if given', () => {
      generator({
        loans: {
          _id: 'loan',
          user: {
            _id: 'user',
            assignedEmployee: { _id: 'admin', _factory: 'admin' },
          },
        },
      });

      const irId = InsuranceRequestService.insert({ loanId: 'loan' });

      const ir = InsuranceRequestService.get(irId, { user: { _id: 1 } });
      expect(ir.user).to.deep.include({ _id: 'user' });
    });

    it('links the borrowers if given', () => {
      generator({
        borrowers: [
          { _id: 'b1', _factory: 'borrower' },
          { _id: 'b2', _factory: 'borrower' },
        ],
      });

      const irId = InsuranceRequestService.insert({
        borrowerIds: ['b1', 'b2'],
      });

      const ir = InsuranceRequestService.get(irId, { borrowers: { _id: 1 } });
      expect(ir.borrowers.length).to.equal(2);
      expect(ir.borrowers[0]).to.deep.include({ _id: 'b1' });
      expect(ir.borrowers[1]).to.deep.include({ _id: 'b2' });
    });

    it('sets the assignees if given', () => {
      generator({
        users: [
          { _id: 'admin1', _factory: 'admin' },
          { _id: 'admin2', _factory: 'admin' },
        ],
      });

      const irId = InsuranceRequestService.insert({
        assignees: [
          { _id: 'admin1', percent: 50, isMain: true },
          { _id: 'admin2', percent: 50 },
        ],
      });

      const ir = InsuranceRequestService.get(irId, {
        assigneeLinks: { _id: 1, percent: 1, isMain: 1 },
      });
      expect(ir.assigneeLinks.length).to.equal(2);
      expect(ir.assigneeLinks[0]).to.deep.include({
        _id: 'admin1',
        percent: 50,
        isMain: true,
      });
      expect(ir.assigneeLinks[1]).to.deep.include({
        _id: 'admin2',
        percent: 50,
        isMain: false,
      });
    });

    it('uses the loan assignees', () => {
      generator({
        users: [
          { _id: 'admin1', _factory: 'admin' },
          { _id: 'admin2', _factory: 'admin' },
        ],
        loans: {
          _id: 'loan',
          assigneeLinks: [
            { _id: 'admin1', percent: 50, isMain: true },
            { _id: 'admin2', percent: 50 },
          ],
        },
      });

      const irId = InsuranceRequestService.insert({
        loanId: 'loan',
      });

      const ir = InsuranceRequestService.get(irId, {
        assigneeLinks: { _id: 1, percent: 1, isMain: 1 },
      });
      expect(ir.assigneeLinks.length).to.equal(2);
      expect(ir.assigneeLinks[0]).to.deep.include({
        _id: 'admin1',
        percent: 50,
        isMain: true,
      });
      expect(ir.assigneeLinks[1]).to.deep.include({
        _id: 'admin2',
        percent: 50,
        isMain: false,
      });
    });

    it('uses the user assignees when a loan and a user are linked', () => {
      generator({
        users: [
          { _id: 'admin1', _factory: 'admin' },
          { _id: 'admin2', _factory: 'admin' },
          {
            _id: 'user',
            assignedEmployee: { _id: 'admin3', _factory: 'admin' },
          },
        ],
        loans: {
          _id: 'loan',
          assigneeLinks: [
            { _id: 'admin1', percent: 50, isMain: true },
            { _id: 'admin2', percent: 50 },
          ],
        },
      });

      const irId = InsuranceRequestService.insert({
        loanId: 'loan',
        userId: 'user',
      });

      const ir = InsuranceRequestService.get(irId, {
        assigneeLinks: { _id: 1, percent: 1, isMain: 1 },
      });

      expect(ir.assigneeLinks.length).to.equal(1);
      expect(ir.assigneeLinks[0]).to.deep.include({
        _id: 'admin3',
        percent: 100,
        isMain: true,
      });
    });

    it('uses the given assignees even if a loan or a user is linked', () => {
      generator({
        users: [
          { _id: 'admin1', _factory: 'admin' },
          { _id: 'admin2', _factory: 'admin' },
          {
            _id: 'user',
            assignedEmployee: { _id: 'admin3', _factory: 'admin' },
          },
          { _id: 'admin4', _factory: 'admin' },
          { _id: 'admin5', _factory: 'admin' },
        ],
        loans: {
          _id: 'loan',
          assigneeLinks: [
            { _id: 'admin1', percent: 50, isMain: true },
            { _id: 'admin2', percent: 50 },
          ],
        },
      });

      const irId = InsuranceRequestService.insert({
        loanId: 'loan',
        userId: 'user',
        assignees: [
          { _id: 'admin4', percent: 50, isMain: true },
          { _id: 'admin5', percent: 50 },
        ],
      });

      const ir = InsuranceRequestService.get(irId, {
        assigneeLinks: { _id: 1, percent: 1, isMain: 1 },
      });
      expect(ir.assigneeLinks.length).to.equal(2);
      expect(ir.assigneeLinks[0]).to.deep.include({
        _id: 'admin4',
        percent: 50,
        isMain: true,
      });
      expect(ir.assigneeLinks[1]).to.deep.include({
        _id: 'admin5',
        percent: 50,
        isMain: false,
      });
    });
  });
});
