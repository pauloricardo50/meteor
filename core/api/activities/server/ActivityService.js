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

  addCreatedAtActivity({ createdAt, ...rest }) {
    const { metadata = {}, ...activity } = rest;
    return this.addServerActivity({
      metadata: { event: ACTIVITY_EVENT_METADATA.CREATED, ...metadata },
      date: createdAt,
      type: ACTIVITY_TYPES.EVENT,
      ...activity,
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
