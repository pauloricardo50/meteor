import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check, Match } from 'meteor/check';
import { Job } from 'meteor/vsivsi:job-collection';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import jc from './jobs';

export const scheduleMethod = new ValidatedMethod({
  name: 'jobs.scheduleMethod',
  mixins: [CallPromiseMixin],
  validate({ method, params, date }) {
    console.log('scheduleMethod arguments: ', method, params, date);
    check(method, String);
    check(params, [Match.OneOf(String, Number, Object)]);
    check(date, Date);
  },
  run({ method, params, date }) {
    console.log('creating a job..');
    const jobId = new Job(jc, 'scheduleMethod', { method, params })
      .after(date)
      .save();
    return jobId;
  },
});

export const canceljob = new ValidatedMethod({
  name: 'jobs.cancel',
  mixins: [CallPromiseMixin],
  validate: ({ id }) => check(id, String),
  run: ({ id }) => jc.cancelJobs([id]),
});

export const removeJob = new ValidatedMethod({
  name: 'jobs.remove',
  mixins: [CallPromiseMixin],
  validate: ({ id }) => check(id, String),
  run: ({ id }) => jc.removeJobs([id]),
});
