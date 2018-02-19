import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check, Match } from 'meteor/check';
import { Job } from 'meteor/vsivsi:job-collection';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import jc from './jobs';

// Schedules a method at a given date, to be called with params
export const scheduleMethod = new ValidatedMethod({
  name: 'scheduleMethod',
  mixins: [CallPromiseMixin],
  validate({ method, params, date }) {
    check(method, String);
    check(params, [Match.OneOf(String, Number, Object)]);
    check(date, Date);
  },
  run({ method, params, date }) {
    const jobId = new Job(jc, 'scheduleMethod', { method, params })
      .after(date)
      .save();
    return jobId;
  },
});

export const canceljob = new ValidatedMethod({
  name: 'canceljob',
  mixins: [CallPromiseMixin],
  validate: ({ id }) => check(id, String),
  run: ({ id }) => jc.cancelJobs([id]),
});

export const removeJob = new ValidatedMethod({
  name: 'removeJob',
  mixins: [CallPromiseMixin],
  validate: ({ id }) => check(id, String),
  run: ({ id }) => jc.removeJobs([id]),
});
