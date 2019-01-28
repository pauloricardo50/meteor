import LenderRules from '../lenderRules';
import CollectionService from '../../helpers/CollectionService';

class LenderRulesService extends CollectionService {
  constructor() {
    super(LenderRules);
  }

  insert({ organisationId }) {
    const id = super.insert({});
    this.addLink({ id, linkName: 'organisation', linkId: organisationId });
    return id;
  }

  update({ lenderRulesId, object }) {
    this._update({ id: lenderRulesId, object });
  }

  addLenderRulesFilter({ lenderRulesId, filter }) {
    // Do stuff
  }
}

export default new LenderRulesService();
