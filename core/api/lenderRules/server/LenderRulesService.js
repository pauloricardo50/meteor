import { Meteor } from 'meteor/meteor';

import OrganisationService from '../../organisations/server/OrganisationService';
import LenderRules from '../lenderRules';
import CollectionService from '../../helpers/CollectionService';
import {
  DEFAULT_VALUE_FOR_ALL,
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
    const { lenderRules = [] } = OrganisationService.fetchOne({
      $filters: { _id: organisationId },
      lenderRules: { _id: 1 },
    });

    const lenderRulesId = super.insert({
      ...object,
      filter: { and: logicRules },
      order: lenderRules.length,
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

  updateFilter({ lenderRulesId, logicRules, name }) {
    return this._update({
      id: lenderRulesId,
      object: { filter: { and: logicRules }, name },
    });
  }

  setOrder({ orders }) {
    Object.keys(orders).forEach((lenderRulesId) => {
      const nextOrder = orders[lenderRulesId];
      this.update({ lenderRulesId, object: { order: nextOrder } });
    });
  }
}

export default new LenderRulesService();
