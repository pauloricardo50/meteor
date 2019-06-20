import CollectionService from '../../helpers/CollectionService';
import Activities from '../activities';

class ActivityService extends CollectionService {
  constructor() {
    super(Activities);
  }
}

export default new ActivityService();
