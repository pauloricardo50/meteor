import React from 'react';
import { compose, withState } from 'recompose';

import {
  PromotionsTable,
  BasePromotionsTableContainer,
} from 'core/components/PromotionsTable';
import { withSmartQuery } from 'core/api/containerToolkit';
import { adminPromotions } from 'core/api/promotions/queries';
import { PROMOTION_STATUS } from 'core/api/constants';
import MongoSelect from 'core/components/Select/MongoSelect';

export default compose(
  withState('status', 'setStatus'),
  withSmartQuery({
    query: adminPromotions,
    params: ({ status }) => ({ status }),
    dataName: 'promotions',
    queryOptions: { reactive: false },
    renderMissingDoc: false,
  }),
  Component => ({ status, setStatus, ...props }) => (
    <>
      <div style={{ marginTop: 16 }}>
        <MongoSelect
          value={status}
          onChange={setStatus}
          options={PROMOTION_STATUS}
          id="status"
          label="Statut"
        />
      </div>
      <Component {...props} />
    </>
  ),
  BasePromotionsTableContainer,
)(PromotionsTable);
