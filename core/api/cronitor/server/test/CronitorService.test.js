/* eslint-env mocha */
import { expect } from 'chai';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import CronitorService from '../CronitorService';

const CRONITOR_ID = 'rrOCZ7';

const TestCollection = new Mongo.Collection('testCollection');
const testSchema = new SimpleSchema({
  value: { type: Number, min: 0, max: 10 },
});
TestCollection.attachSchema(testSchema);

describe('CronitorService', function () {
  this.timeout(10000);

  const cronitor = new CronitorService({
    id: CRONITOR_ID,
  });

  it('runs', () => cronitor.run().then(msg => expect(msg).to.equal('')));

  it('completes', () =>
    cronitor.complete('complete').then(msg => expect(msg).to.equal('')));

  it('pauses', () =>
    cronitor
      .pause(1)
      .then(msg => expect(msg).to.include('is paused for 1 hour')));

  it('fails with string', () =>
    cronitor.fail('it failed').then(msg => expect(msg).to.equal('')));

  it('fails with Error', () =>
    cronitor
      .fail(new Error('it failed'))
      .then(msg => expect(msg).to.equal('')));

  it('fails with Meteor Error', () =>
    cronitor
      .fail(new Meteor.Error('it failed'))
      .then(msg => expect(msg).to.equal('')));

  it('fails with error from mongo', () => {
    try {
      TestCollection.insert({ value: -1 });
    } catch (error) {
      cronitor.fail(error).then(msg => expect(msg).to.equal(''));
    }
  });
});
