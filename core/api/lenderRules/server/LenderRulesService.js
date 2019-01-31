import { Meteor } from 'meteor/meteor';

import { RESIDENCE_TYPE } from '../../constants';
import LenderRules from '../lenderRules';
import CollectionService from '../../helpers/CollectionService';
import {
  DEFAULT_VALUE_FOR_ALL,
  LENDER_RULES_OPERATORS,
  DEFAULT_MAIN_RESIDENCE_RULES,
  DEFAULT_SECONDARY_RESIDENCE_RULES,
} from '../lenderRulesConstants';

class LenderRulesService extends CollectionService {
  constructor() {
    super(LenderRules);
  }

  remove({ lenderRulesId }) {
    return super.remove(lenderRulesId);
  }

  initialize({ organisationId }) {
    const id1 = this.insert({
      organisationId,
      object: DEFAULT_VALUE_FOR_ALL,
      logicRules: [true],
    });
    const id2 = this.insert({
      organisationId,
      object: { maxBorrowRatio: 0.8 },
      logicRules: DEFAULT_MAIN_RESIDENCE_RULES,
    });
    const id3 = this.insert({
      organisationId,
      object: { maxBorrowRatio: 0.7 },
      logicRules: DEFAULT_SECONDARY_RESIDENCE_RULES,
    });

    return [id1, id2, id3];
  }

  insert({ organisationId, object = {}, logicRules }) {
    const lenderRulesId = super.insert({
      ...object,
      filter: { and: logicRules },
    });

    this.addLink({
      id: lenderRulesId,
      linkName: 'organisation',
      linkId: organisationId,
    });

    return lenderRulesId;
  }

  update({ lenderRulesId, object }) {
    if (object.filter) {
      throw new Meteor.Error('You can not update the filter here');
    }

    return this._update({ id: lenderRulesId, object });
  }

  updateFilter({ lenderRulesId, logicRules }) {
    return this._update({
      id: lenderRulesId,
      object: { filter: { and: logicRules } },
    });
  }
}

export default new LenderRulesService();
