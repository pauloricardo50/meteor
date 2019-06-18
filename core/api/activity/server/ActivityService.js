import CollectionService from '../../helpers/CollectionService';
import Activities from '../activity';

class ActivityService extends CollectionService {
  constructor() {
    super(Activities);
  }
}

export default new ActivityService();
