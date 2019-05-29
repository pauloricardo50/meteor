// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { Users, Contacts } from '../../..';
import { up, down } from '../16';

describe.only('Migration 16', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('formats phone numbers', async () => {
      await Users.rawCollection().insert({
        _id: '2',
        phoneNumbers: ['225660110'],
      });
      await Contacts.rawCollection().insert({
        _id: '3',
        phoneNumbers: ['0033 1 09 75 83 51'],
      });

      await up();

      expect(Users.find().fetch()[0].phoneNumbers).to.deep.equal([
        '+41 22 566 01 10',
      ]);
      expect(Contacts.find().fetch()[0].phoneNumbers).to.deep.equal([
        '+33 1 09 75 83 51',
      ]);
    });

    it('does not fail if no phone numbers exist', async () => {
      await Users.rawCollection().insert({ _id: '2' });

      await up();

      expect(Users.find().fetch()[0].phoneNumbers).to.deep.equal([]);
    });

    it('does not format garbage', async () => {
      await Users.rawCollection().insert({ _id: '2', phoneNumbers: ['asd'] });

      await up();

      expect(Users.find().fetch()[0].phoneNumbers).to.deep.equal(['asd']);
    });
  });

  describe('down', () => {});
});
