import CollectionService from '../../helpers/CollectionService';
import Activities from '../activities';
import { ACTIVITY_TYPES, ACTIVITY_SECONDARY_TYPES } from '../activityConstants';

class ActivityService extends CollectionService {
  constructor() {
    super(Activities);
  }

  addCreatedAtActivity({ createdAt, ...rest }) {
    return this.insert({
      type: ACTIVITY_TYPES.SERVER,
      secondaryType: ACTIVITY_SECONDARY_TYPES.CREATED,
      date: createdAt,
      ...rest,
    });
  }
}

export default new ActivityService();
