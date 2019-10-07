import CollectionService from '../../helpers/CollectionService';
import Activities from '../activities';
import { ACTIVITY_EVENT_METADATA, ACTIVITY_TYPES } from '../activityConstants';

class ActivityService extends CollectionService {
  constructor() {
    super(Activities);
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
    return this._update({
      id: createdAtActivity._id,
      object: { date: createdAt },
    });
  }
}

export default new ActivityService();
