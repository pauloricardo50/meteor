import { Job } from 'meteor/vsivsi:job-collection';
import Jobs from './jobs';
import { SCHEDULE_METHOD } from './jobConstants';

class JobService {
  scheduleMethod = ({ method, params, date }) => {
    const jobId = new Job(Jobs, SCHEDULE_METHOD, { method, params })
      .after(date)
      .save();
    return jobId;
  };

  scheduleMutation = ({ mutation: { name }, params, date }) =>
    this.scheduleMethod({ method: name, params, date });

  cancelJob = ({ jobId }) => Jobs.cancelJobs([jobId]);

  removeJob = ({ jobId }) => Jobs.removeJobs([jobId]);

  cancelExistingJob = ({ method, params }) => {
    const job = Jobs.findOne({ 'data.method': method, 'data.params': params });
    if (job && job._id) {
      this.cancelJob({ jobId: job._id });
    }
  };

  cancelExistingMutationJob = ({ mutation: { name }, params }) => {
    this.cancelExistingJob({ method: name, params });
  };
}

export default new JobService();
