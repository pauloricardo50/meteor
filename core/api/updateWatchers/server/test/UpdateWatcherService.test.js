// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/dburles:factory';

import UpdateWatcherService from '../UpdateWatcherService';

const collectionName = 'todos_test';
const Todos = new Mongo.Collection(collectionName);

describe('UpdateWatcherService', () => {
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

      const updateWatcher = UpdateWatcherService.get(
        {},
        { docId: 1, collection: 1, updatedFields: 1 },
      );

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

      const updateWatcher = UpdateWatcherService.get({}, { updatedFields: 1 });

      expect(updateWatcher.updatedFields).to.deep.equal([
        { fieldName: 'title', previousValue: 'Yo!', currentValue: 'Ha2' },
      ]);

      hook.remove();
    });

    it('updates existing updateWatchers (more advanced)', () => {
      const hook = UpdateWatcherService.addUpdateWatching({
        collection: Todos,
        fields: ['title', 'description', 'checked'],
      });

      const todoId = Todos.insert({ title: 'Yo!', checked: false });

      Todos.update(todoId, { title: 'Ha1', checked: true });
      Todos.update(todoId, { title: 'Ha2', description: 'hi' });

      const updateWatcher = UpdateWatcherService.get({}, { updatedFields: 1 });

      expect(updateWatcher.updatedFields).to.deep.equal([
        { fieldName: 'title', previousValue: 'Yo!', currentValue: 'Ha2' },
        { fieldName: 'checked', previousValue: false, currentValue: true },
        { fieldName: 'description', currentValue: 'hi' },
      ]);

      hook.remove();
    });

    it('creates an updateWatcher with arrays', () => {
      const hook = UpdateWatcherService.addUpdateWatching({
        collection: Todos,
        fields: ['names'],
      });

      const todoId = Todos.insert({ names: ['ha1', 'ha2'] });

      Todos.update(todoId, { names: ['ha1', 'ha3'] });

      const updateWatcher = UpdateWatcherService.get(
        {},
        { docId: 1, collection: 1, updatedFields: 1 },
      );

      expect(updateWatcher).to.deep.include({
        docId: todoId,
        collection: collectionName,
        updatedFields: [
          {
            fieldName: 'names',
            previousValue: ['ha1', 'ha2'],
            currentValue: ['ha1', 'ha3'],
          },
        ],
      });

      hook.remove();
    });
  });

  describe('processUpdateWatcher', () => {
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

      const updateWatcher = UpdateWatcherService.get(updateWatcherId, {
        userId: 1,
        collection: 1,
        docId: 1,
        updatedFields: 1,
      });

      UpdateWatcherService.processUpdateWatcher(updateWatcher);

      expect(UpdateWatcherService.fetch({}).length).to.equal(0);
    });
  });

  describe('formatUpdatedFields', () => {
    it('does not fail when formatting value', () => {
      expect(
        UpdateWatcherService.formatUpdatedFields([
          { currentValue: 100, fieldName: 'value' },
        ]),
      ).to.equal("*Prix d'achat*: 100");
    });
  });

  describe('formatValue', () => {
    it('renders booleans properly', () => {
      expect(UpdateWatcherService.formatValue(true)).to.equal('Oui');
      expect(UpdateWatcherService.formatValue(false)).to.equal('Non');
    });

    it('renders falsy values properly', () => {
      expect(UpdateWatcherService.formatValue(null)).to.equal('-');
      expect(UpdateWatcherService.formatValue(undefined)).to.equal('-');
    });

    it('formats numbers properly if they are small or large', () => {
      expect(UpdateWatcherService.formatValue(0)).to.equal('0');
      expect(UpdateWatcherService.formatValue(1000)).to.equal('1 000');
      expect(UpdateWatcherService.formatValue(0.01)).to.equal('1.00%');
    });

    it('formats numbers properly if they are small or large', () => {
      expect(
        UpdateWatcherService.formatValue(
          new Date('December 17, 1995 03:24:00'),
        ),
      ).to.equal('17/12/1995');
    });

    it('formats arrays properly', () => {
      expect(UpdateWatcherService.formatValue(['a', 'b'])).to.equal('a\nb');
    });

    it('formats objects properly', () => {
      expect(
        UpdateWatcherService.formatValue({ a: 10, b: 'yo' }, 'obj'),
      ).to.equal('*Forms.obj.a*: 10, *Forms.obj.b*: yo');
    });
  });

  describe('formatArrayDiff', () => {
    it('only shows the difference', () => {
      expect(
        UpdateWatcherService.formatArrayDiff(
          'arr',
          ['ha1', 'ha2'],
          ['ha1', 'ha3'],
        ),
      ).to.equal('*Forms.arr*:\n`2`\nha2 -> ha3');
    });

    it('only shows the difference in objects when added', () => {
      expect(
        UpdateWatcherService.formatArrayDiff(
          'arr',
          [{ id: 'ha1' }, { id: 'ha2' }],
          [{ id: 'ha1' }, { id: 'ha3' }, { id: 'ha4' }],
        ),
      ).to.equal(
        '*Forms.arr*:\n`2`\n*Forms.arr.id*: ha2 -> ha3\n`3`\n*Forms.arr.id*: ha4',
      );
    });

    it('only shows the difference in objects when added and new keys', () => {
      expect(
        UpdateWatcherService.formatArrayDiff(
          'arr',
          [{ a: 'b', id: 'ha2' }],
          [{ a: 'b', id: 'ha3', yo: 'dude' }],
        ),
      ).to.equal(
        '*Forms.arr*:\n`1`\n*Forms.arr.id*: ha2 -> ha3\n*Forms.arr.yo*: dude',
      );
    });

    it('only shows the difference in objects when removed', () => {
      expect(
        UpdateWatcherService.formatArrayDiff(
          'arr',
          [{ id: 'ha1' }, { id: 'ha2' }],
          [{ id: 'ha1' }],
        ),
      ).to.equal('*Forms.arr*:\n`2`\n*Forms.arr.id*: ha2 -> _supprimé_');
    });
  });
});
