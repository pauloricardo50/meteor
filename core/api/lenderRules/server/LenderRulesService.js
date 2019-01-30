import { Meteor } from 'meteor/meteor';

import { RESIDENCE_TYPE } from '../../constants';
import LenderRules from '../lenderRules';
import CollectionService from '../../helpers/CollectionService';
import { DEFAULT_VALUE_FOR_ALL } from '../lenderRulesConstants';

class LenderRulesService extends CollectionService {
  constructor() {
    super(LenderRules);
  }

  initialize({ organisationId }) {
    this.insert({
      organisationId,
      object: DEFAULT_VALUE_FOR_ALL,
      logicRules: [true],
    });
    this.insert({
      organisationId,
      object: { maxBorrowRatio: 0.8 },
      logicRules: [
        { '===': [{ var: 'residenceType' }, RESIDENCE_TYPE.MAIN_RESIDENCE] },
      ],
    });
    this.insert({
      organisationId,
      object: { maxBorrowRatio: 0.7 },
      logicRules: [
        { '===': [{ var: 'residenceType' }, RESIDENCE_TYPE.SECOND_RESIDENCE] },
      ],
    });
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
}

export default new LenderRulesService();
