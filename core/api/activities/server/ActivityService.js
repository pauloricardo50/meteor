import CollectionService from '../../helpers/CollectionService';
import Activities from '../activities';
import { ACTIVITY_EVENT_METADATA, ACTIVITY_TYPES } from '../activityConstants';
import { activity as activityFragment } from '../../fragments';

class ActivityService extends CollectionService {
  constructor() {
    super(Activities);
    this.get = this.makeGet(activityFragment());
  }

  addServerActivity(activity) {
    return this.insert({ ...activity, isServerGenerated: true });
  }

  addCreatedAtActivity({ createdAt, metadata = {}, ...rest }) {
    return this.addServerActivity({
      metadata: { event: ACTIVITY_EVENT_METADATA.CREATED, ...metadata },
      date: createdAt,
      type: ACTIVITY_TYPES.EVENT,
      ...rest,
    });
  }

  addEventActivity({ event, details, ...rest }) {
    return this.insert({
      type: ACTIVITY_TYPES.EVENT,
      metadata: { event, details },
      ...rest,
    });
  }

  addEmailActivity({ emailId, to, from, response, ...rest }) {
    return this.insert({
      type: ACTIVITY_TYPES.EMAIL,
      metadata: { emailId, to, from, response },
      ...rest,
    });
  }

  updateCreatedAtActivity({ createdAt, loanId }) {
    const createdAtActivity = this.fetchOne({
      $filters: {
        'loanLink._id': loanId,
        metadata: { event: ACTIVITY_EVENT_METADATA.CREATED },
      },
    });
    this.rawCollection.update(
      {
        _id: createdAtActivity._id,
      },
      { $set: { date: createdAt } },
    );
  }

  updateDescription({ id, description }) {
    this.rawCollection.update({ _id: id }, { $set: { description } });
  }
}

export default new ActivityService();
