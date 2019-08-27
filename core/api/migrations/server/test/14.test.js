// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { Properties } from '../../..';
import { up, down } from '../14';

describe('Migration 14', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('adds yearly and removes monthly expenses', async () => {
      await Properties.rawCollection().insert({
        _id: 'test',
        monthlyExpenses: 100,
      });
      await Properties.rawCollection().insert({
        _id: 'test2',
      });
      await up();

      expect(Properties.findOne({ _id: 'test' }).yearlyExpenses).to.equal(1200);
      expect(Properties.findOne({ _id: 'test' }).monthlyExpenses).to.equal(undefined);
      expect(Properties.findOne({ _id: 'test2' }).yearlyExpenses).to.equal(undefined);
      expect(Properties.findOne({ _id: 'test2' }).monthlyExpenses).to.equal(undefined);
    });
  });

  describe('down', () => {
    it('adds monthly and removes yearly expenses', async () => {
      await Properties.rawCollection().insert({
        _id: 'test',
        yearlyExpenses: 1000,
      });
      await Properties.rawCollection().insert({
        _id: 'test2',
      });

      await down();

      expect(Properties.findOne({ _id: 'test' }).yearlyExpenses).to.equal(undefined);
      expect(Properties.findOne({ _id: 'test' }).monthlyExpenses).to.equal(83);
      expect(Properties.findOne({ _id: 'test2' }).yearlyExpenses).to.equal(undefined);
      expect(Properties.findOne({ _id: 'test2' }).monthlyExpenses).to.equal(undefined);
    });
  });
});
