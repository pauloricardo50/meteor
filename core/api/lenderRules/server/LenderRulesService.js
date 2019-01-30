import { Meteor } from 'meteor/meteor';

import { RESIDENCE_TYPE } from '../../constants';
import LenderRules from '../lenderRules';
import CollectionService from '../../helpers/CollectionService';

class LenderRulesService extends CollectionService {
  constructor() {
    super(LenderRules);
  }

  initialize({ organisationId }) {
    const lenderRulesId1 = this.insert({
      organisationId,
      object: { filter: { and: [true] } },
    });
    const lenderRulesId2 = this.insert({
      organisationId,
      object: {
        filter: {
          and: [
            {
              '===': [{ var: 'residenceType' }, RESIDENCE_TYPE.MAIN_RESIDENCE],
            },
          ],
        },
        maxBorrowRatio: 0.8,
      },
    });
    const lenderRulesId3 = this.insert({
      organisationId,
      object: {
        filter: {
          and: [
            {
              '===': [
                { var: 'residenceType' },
                RESIDENCE_TYPE.SECOND_RESIDENCE,
              ],
            },
          ],
        },
        maxBorrowRatio: 0.7,
      },
    });
  }

  insert({ organisationId, object = {} }) {
    const lenderRulesId = super.insert(object);

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
