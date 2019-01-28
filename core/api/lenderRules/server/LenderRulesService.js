import { Random } from 'meteor/random';
import { Meteor } from 'meteor/meteor';

import { RESIDENCE_TYPE } from '../../constants';
import LenderRules from '../lenderRules';
import CollectionService from '../../helpers/CollectionService';

class LenderRulesService extends CollectionService {
  constructor() {
    super(LenderRules);
  }

  insert({ organisationId }) {
    const lenderRulesId = super.insert({});

    this.addLenderRulesFilter({
      lenderRulesId,
      filter: {
        and: [
          { '===': [{ var: 'residenceType' }, RESIDENCE_TYPE.MAIN_RESIDENCE] },
        ],
      },
      rules: { maxBorrowRatio: 0.8 },
    });
    this.addLenderRulesFilter({
      lenderRulesId,
      filter: {
        and: [
          {
            '===': [{ var: 'residenceType' }, RESIDENCE_TYPE.SECOND_RESIDENCE],
          },
        ],
      },
      rules: { maxBorrowRatio: 0.7 },
    });
    this.addLink({
      id: lenderRulesId,
      linkName: 'organisation',
      linkId: organisationId,
    });

    return lenderRulesId;
  }

  update({ lenderRulesId, object }) {
    return this._update({ id: lenderRulesId, object });
  }

  addLenderRulesFilter({ lenderRulesId, filter, rules = {} }) {
    return this._update({
      id: lenderRulesId,
      object: { filters: { id: Random.id(), filter, ...rules } },
      operator: '$push',
    });
  }

  removeFilter({ lenderRulesId, filterId }) {
    return this._update({
      id: lenderRulesId,
      object: { filters: { id: filterId } },
      operator: '$pull',
    });
  }

  getFilter({ lenderRulesId, filterId }) {
    const { filters } = this.get(lenderRulesId);
    return filters.find(({ id }) => id === filterId);
  }

  updateFilter({ lenderRulesId, filterId, rules = {} }) {
    if (rules.filter) {
      throw new Meteor.Error('You can not update the filter here');
    }

    const currentFilterValue = this.getFilter({ lenderRulesId, filterId });

    if (!currentFilterValue) {
      throw new Meteor.Error("Ce filtre n'existe pas");
    }

    return this.baseUpdate(
      { _id: lenderRulesId, 'filters.id': filterId },
      { $set: { 'filters.$': { ...currentFilterValue, ...rules } } },
    );
  }
}

export default new LenderRulesService();
