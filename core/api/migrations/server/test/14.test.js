import { resetDatabase } from 'meteor/xolvio:cleaner';

/* eslint-env mocha */
import { expect } from 'chai';

import Properties from '../../../properties/index';
import PropertyService from '../../../properties/server/PropertyService';
import { down, up } from '../14';

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

      expect(
        PropertyService.get('test', { yearlyExpenses: 1 }).yearlyExpenses,
      ).to.equal(1200);
      expect(
        PropertyService.get('test', { monthlyExpenses: 1 }).monthlyExpenses,
      ).to.equal(undefined);
      expect(
        PropertyService.get('test2', { yearlyExpenses: 1 }).yearlyExpenses,
      ).to.equal(undefined);
      expect(
        PropertyService.get('test2', { monthlyExpenses: 1 }).monthlyExpenses,
      ).to.equal(undefined);
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

      expect(
        PropertyService.get('test', { yearlyExpenses: 1 }).yearlyExpenses,
      ).to.equal(undefined);
      expect(
        PropertyService.get('test', { monthlyExpenses: 1 }).monthlyExpenses,
      ).to.equal(83);
      expect(
        PropertyService.get('test2', { yearlyExpenses: 1 }).yearlyExpenses,
      ).to.equal(undefined);
      expect(
        PropertyService.get('test2', { monthlyExpenses: 1 }).monthlyExpenses,
      ).to.equal(undefined);
    });
  });
});
