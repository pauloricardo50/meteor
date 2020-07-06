import React from 'react';
import { compose, withState } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import {
  PROMOTIONS_COLLECTION,
  PROMOTION_STATUS,
} from 'core/api/promotions/promotionConstants';
import {
  BasePromotionsTableContainer,
  PromotionsTable,
} from 'core/components/PromotionsTable';
import MongoSelect from 'core/components/Select/MongoSelect';

export default compose(
  withState('status', 'setStatus'),
  withSmartQuery({
    query: PROMOTIONS_COLLECTION,
    params: ({ status }) => ({
      $filters: { status },
      availablePromotionLots: 1,
      createdAt: 1,
      isTest: 1,
      loanCount: 1,
      name: 1,
      promotionLotLinks: 1,
      promotionLots: { _id: 1 },
      reservedPromotionLots: 1,
      soldPromotionLots: 1,
      status: 1,
    }),
    deps: ({ status }) => [status],
    dataName: 'promotions',
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
