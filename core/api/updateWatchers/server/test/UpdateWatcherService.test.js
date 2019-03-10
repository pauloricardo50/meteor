// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/dburles:factory';

import UpdateWatcherService from '../UpdateWatcherService';

const collectionName = 'todos_test';
const Todos = new Mongo.Collection(collectionName);

describe.only('UpdateWatcherService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('addUpdateWatching', () => {
    it('inserts new updateWatchers', () => {
      const hook = UpdateWatcherService.addUpdateWatching({
        collection: Todos,
        fields: ['title'],
      });

      const todoId = Todos.insert({ title: 'Yo!' });

      Todos.update(todoId, { title: 'Ha' });

      const updateWatcher = UpdateWatcherService.findOne({});

      expect(updateWatcher).to.deep.include({
        docId: todoId,
        collection: collectionName,
        updatedFields: [
          { fieldName: 'title', previousValue: 'Yo!', currentValue: 'Ha' },
        ],
      });

      hook.remove();
    });

    it('updates existing updateWatchers', () => {
      const hook = UpdateWatcherService.addUpdateWatching({
        collection: Todos,
        fields: ['title'],
      });

      const todoId = Todos.insert({ title: 'Yo!' });

      Todos.update(todoId, { title: 'Ha1' });
      Todos.update(todoId, { title: 'Ha2' });

      const updateWatcher = UpdateWatcherService.findOne({});

      expect(updateWatcher.updatedFields).to.deep.equal([
        { fieldName: 'title', previousValue: 'Yo!', currentValue: 'Ha2' },
      ]);

      hook.remove();
    });

    it('updates existing updateWatchers more advance', () => {
      const hook = UpdateWatcherService.addUpdateWatching({
        collection: Todos,
        fields: ['title', 'description', 'checked'],
      });

      const todoId = Todos.insert({ title: 'Yo!', checked: false });

      Todos.update(todoId, { title: 'Ha1', checked: true });
      Todos.update(todoId, { title: 'Ha2', description: 'hi' });

      const updateWatcher = UpdateWatcherService.findOne({});

      expect(updateWatcher.updatedFields).to.deep.equal([
        { fieldName: 'title', previousValue: 'Yo!', currentValue: 'Ha2' },
        { fieldName: 'checked', previousValue: false, currentValue: true },
        { fieldName: 'description', currentValue: 'hi' },
      ]);

      hook.remove();
    });
  });

  describe.only('processUpdateWatcher', () => {
    it('sends a notification to the assignee', () => {
      const testAdmin = Factory.create('admin', {
        emails: [{ address: 'test@e-potek.ch', verified: false }],
      });
      const testUser = Factory.create('user', {
        assignedEmployeeId: testAdmin._id,
        roles: [],
      });
      const borrowerId = Factory.create('borrower', {
        firstName: 'John',
        lastName: 'Doe',
      })._id;

      const updateWatcherId = UpdateWatcherService.insert({
        userId: testUser._id,
        collection: 'borrowers',
        docId: borrowerId,
        updatedFields: [
          {
            fieldName: 'firstName',
            previousValue: 'Joe',
            currentValue: 'John',
          },
          {
            fieldName: 'lastName',
            previousValue: 'Duh',
            currentValue: 'Doe',
          },
        ],
      });

      const updateWatcher = UpdateWatcherService.findOne(updateWatcherId);

      UpdateWatcherService.processUpdateWatcher(updateWatcher);

      expect(UpdateWatcherService.fetch({}).length).to.equal(0);
    });
  });
});
