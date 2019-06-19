// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { ACTIVITY_TYPES } from '../../../activities/activityConstants';
import Activities from '../../../activities';
import Loans from '../../../loans';
import Users from '../../../users';
import { up } from '../17';

describe('Migration 17', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('removes closing and signing dates', async () => {
      await Loans.rawCollection().insert({
        _id: '1',
        name: 'a',
        closingDate: new Date(),
        createdAt: new Date(),
      });
      await Loans.rawCollection().insert({
        _id: '2',
        name: 'b',
        signingDate: new Date(),
        createdAt: new Date(),
      });

      await up();

      Loans.find().forEach((loan) => {
        expect(loan.closingDate).to.equal(undefined);
        expect(loan.signingDate).to.equal(undefined);
      });
    });

    it('Adds up to 3 activities for a loan', async () => {
      await Loans.rawCollection().insert({
        _id: '1',
        createdAt: new Date(),
        signingDate: new Date(),
        closingDate: new Date(),
      });

      await up();

      const activities = Activities.find().fetch();
      expect(activities.length).to.equal(3);

      activities.forEach((activity) => {
        expect(activity.loanLink._id).to.equal('1');
      });

      const events = activities.filter(({ type }) => type === ACTIVITY_TYPES.EVENT);
      expect(events.length).to.equal(2);

      const server = activities.filter(({ type }) => type === ACTIVITY_TYPES.SERVER);
      expect(server.length).to.equal(1);
    });

    it('Adds 2 activities for a loan', async () => {
      await Loans.rawCollection().insert({
        _id: '1',
        createdAt: new Date(),
        signingDate: new Date(),
      });

      await up();

      const activities = Activities.find().fetch();
      expect(activities.length).to.equal(2);

      activities.forEach((activity) => {
        expect(activity.loanLink._id).to.equal('1');
      });

      const events = activities.filter(({ type }) => type === ACTIVITY_TYPES.EVENT);
      expect(events.length).to.equal(1);

      const server = activities.filter(({ type }) => type === ACTIVITY_TYPES.SERVER);
      expect(server.length).to.equal(1);
    });

    it('adds the assignee on the activity as creator', async () => {
      await Users.rawCollection().insert({
        _id: '2',
      });
      await Users.rawCollection().insert({
        _id: '3',
        assignedEmployeeId: '2',
      });
      await Loans.rawCollection().insert({
        _id: '1',
        userId: '3',
        createdAt: new Date(),
        signingDate: new Date(),
        closingDate: new Date(),
      });

      await up();

      const activities = Activities.find().fetch();

      const events = activities.filter(({ type }) => type === ACTIVITY_TYPES.EVENT);
      expect(events.length).to.equal(2);

      events.forEach((event) => {
        expect(event.createdBy).to.equal('2');
      });
    });
  });

  describe('down', () => {});
});
