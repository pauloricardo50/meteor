import { Meteor } from 'meteor/meteor';
import { JobCollection } from 'meteor/vsivsi:job-collection';
import { SCHEDULE_METHOD } from './jobConstants';

const Jobs = new JobCollection('jobs');

const jobList = [
  {
    type: SCHEDULE_METHOD,
    options: { pollInterval: 5000 },
    run: (data, callback) => {
      console.log('calling scheduled method..');

      const { method, params } = data;

      if (typeof method !== 'string') {
        throw new Error('invalid method name');
      }

      Meteor.call(method, ...params, (err, result) => {
        if (err) {
          callback(err, undefined);
        } else {
          callback(err, result);
        }
      });
    },
  },
];

jobList.forEach((jobObject) => {
  Jobs.processJobs(
    jobObject.type,
    { pollInterval: 5000, ...jobObject.options },
    (job, callback) => {
      const { type, data, done, fail } = job;
      try {
        jobObject.run(data, (err, result) => {
          if (err) {
            fail(err);
          } else {
            done(result);
          }
          callback();
        });
      } catch (error) {
        fail(error);
        callback();
      }
    },
  );
});

export default Jobs;
