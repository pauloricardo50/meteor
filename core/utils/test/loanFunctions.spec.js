/* eslint-env mocha */
import { expect } from 'chai';

import { Signer } from 'aws-sdk/clients/cloudfront';
import { formatLoanWithStructure, nextDueTaskReducer } from '../loanFunctions';
import { LOAN_STATUS, TASK_STATUS } from '../../api/constants';

describe('Loan functions', () => {
  describe('formatLoanWithStructure', () => {
    it('sets the right structure', () => {
      expect(formatLoanWithStructure({
        selectedStructure: 'test',
        structures: [{ id: 'test', hello: 'world' }],
      })).to.deep.include({ id: 'test', hello: 'world' });
    });

    it('adds an empty structure if the structure was not found', () => {
      expect(formatLoanWithStructure({
        selectedStructure: 'test2',
        structures: [{ id: 'test', hello: 'world' }],
      })).to.deep.include({});
    });

    it('adds an empty structure if selectedStructure is not defined', () => {
      expect(formatLoanWithStructure({
        structures: [{ id: 'test', hello: 'world' }],
      })).to.deep.equal({});
    });

    it('adds the right property if it exists', () => {
      expect(formatLoanWithStructure({
        properties: [{ _id: 'property1', value: 100 }],
        selectedStructure: 'test',
        structures: [{ id: 'test', propertyId: 'property1' }],
      })).to.deep.include({
        id: 'test',
        propertyId: 'property1',
        property: { _id: 'property1', value: 100 },
      });
    });

    it('adds the right offer if it exists', () => {
      expect(formatLoanWithStructure({
        offers: [{ _id: 'offer1', amortization: 100 }],
        selectedStructure: 'test',
        structures: [{ id: 'test', offerId: 'offer1' }],
      })).to.deep.include({
        id: 'test',
        offerId: 'offer1',
        offer: { _id: 'offer1', amortization: 100 },
      });
    });

    it('adds both offer and property', () => {
      expect(formatLoanWithStructure({
        offers: [{ _id: 'offer1', amortization: 100 }],
        properties: [{ _id: 'property1', value: 100 }],
        selectedStructure: 'test',
        structures: [
          { id: 'test', offerId: 'offer1', propertyId: 'property1' },
        ],
      })).to.deep.include({
        id: 'test',
        offerId: 'offer1',
        propertyId: 'property1',
        offer: { _id: 'offer1', amortization: 100 },
        property: { _id: 'property1', value: 100 },
      });
    });

    it('returns undefined if no structures exist', () => {
      expect(formatLoanWithStructure({
        selectedStructure: 'test',
        structures: [],
      })).to.deep.equal(undefined);
    });
  });

  describe('nextDueTaskReducer', () => {
    it('returns undefined if no dates exist', () => {
      const loan = {};
      expect(nextDueTaskReducer(loan)).to.equal(undefined);
    });

    it('gets the next task date', () => {
      const signingDate = new Date();
      signingDate.setDate(signingDate.getDate() + 2);
      const taskDate1 = new Date();
      taskDate1.setDate(taskDate1.getDate() - 1);
      const taskDate2 = new Date();
      taskDate2.setDate(taskDate2.getDate() - 2);
      const tasksCache = [
        { dueAt: taskDate1, title: 'task A', status: TASK_STATUS.ACTIVE },
        { dueAt: taskDate2, title: 'task B', status: TASK_STATUS.ACTIVE },
      ];
      const loan = { signingDate, tasksCache };
      expect(nextDueTaskReducer({ ...loan, status: LOAN_STATUS.CLOSING })).to.deep.include({
        dueAt: taskDate2,
        title: 'task B',
      });
    });

    it('only returns active task dates', () => {
      const taskDate1 = new Date();
      taskDate1.setDate(taskDate1.getDate() - 1);
      const taskDate2 = new Date();
      taskDate2.setDate(taskDate2.getDate() - 2);
      const tasksCache = [
        { dueAt: taskDate1, title: 'task A', status: TASK_STATUS.ACTIVE },
        { dueAt: taskDate2, title: 'task B', status: TASK_STATUS.CANCELLED },
      ];
      const loan = { tasksCache };
      expect(nextDueTaskReducer({ ...loan, status: LOAN_STATUS.CLOSING })).to.deep.include({
        dueAt: taskDate1,
        title: 'task A',
        status: TASK_STATUS.ACTIVE,
      });
    });
  });
});
