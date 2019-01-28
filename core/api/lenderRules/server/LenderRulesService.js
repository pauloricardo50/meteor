import LenderRules from '../lenderRules';
import CollectionService from '../../helpers/CollectionService';

class LenderRulesService extends CollectionService {
  constructor() {
    super(LenderRules);
  }
}

export default new LenderRulesService();
