/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import generator from '../../../factories';
import { Organisations } from '../../..';

import { up, down } from '../6';

describe('Migration 6', () => {
  beforeEach(() => {
    resetDatabase();
    generator({
      organisations: { _factory: 'organisation', _id: 'org' },
      contacts: { _factory: 'contact', _id: 'contact' },
      users: { _factory: 'pro', _id: 'user' },
    });
  });
  describe('up', () => {
    it('renames role into title', () =>
      Organisations.rawCollection()
        .update(
          { _id: 'org' },
          {
            $set: {
              contactIds: [{ _id: 'contact', role: 'test' }],
              userLinks: [{ _id: 'user', role: 'test' }],
            },
          },
        )
        .then(up)
        .then(() => {
          const { contactIds = [], userLinks = [] } = Organisations.findOne({
            _id: 'org',
          });
          expect(contactIds.length).to.equal(1);
          expect(userLinks.length).to.equal(1);
          expect(contactIds[0]._id).to.equal('contact');
          expect(contactIds[0].title).to.equal('test');
          expect(contactIds[0].role).to.equal(undefined);
          expect(userLinks[0]._id).to.equal('user');
          expect(userLinks[0].title).to.equal('test');
          expect(userLinks[0].role).to.equal(undefined);
        }));
  });

  describe('down', () => {
    it('renames title into role', () =>
      Organisations.rawCollection()
        .update(
          { _id: 'org' },
          {
            $set: {
              contactIds: [{ _id: 'contact', title: 'test' }],
              userLinks: [{ _id: 'user', title: 'test' }],
            },
          },
        )
        .then(down)
        .then(() => {
          const { contactIds = [], userLinks = [] } = Organisations.findOne({
            _id: 'org',
          });
          expect(contactIds.length).to.equal(1);
          expect(userLinks.length).to.equal(1);
          expect(contactIds[0]._id).to.equal('contact');
          expect(contactIds[0].role).to.equal('test');
          expect(contactIds[0].title).to.equal(undefined);
          expect(userLinks[0]._id).to.equal('user');
          expect(userLinks[0].role).to.equal('test');
          expect(userLinks[0].title).to.equal(undefined);
        }));
  });
});
