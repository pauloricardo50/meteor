import CollectionService from '../../helpers/CollectionService';
import Activities from '../activities';
import { ACTIVITY_TYPES, ACTIVITY_SECONDARY_TYPES } from '../activityConstants';

class ActivityService extends CollectionService {
  constructor() {
    super(Activities);
  }

  addServerActivity(activity) {
    return this.insert({ ...activity, type: ACTIVITY_TYPES.SERVER });
  }

  addCreatedAtActivity({ createdAt, ...rest }) {
    return this.addServerActivity({
      secondaryType: ACTIVITY_SECONDARY_TYPES.CREATED,
      date: createdAt,
      ...rest,
    });
  }

  updateCreatedAtActivity({ createdAt, loanId }) {
    const createdAtActivity = this.fetchOne({
      $filters: {
        'loanLink._id': loanId,
        secondaryType: ACTIVITY_SECONDARY_TYPES.CREATED,
      },
    });
    return this._update({
      id: createdAtActivity._id,
      object: { date: createdAt },
    });
  }
}

export default new ActivityService();
