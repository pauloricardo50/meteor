import React from 'react';

import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import { CollectionIconLink } from 'core/components/IconLink';
import StatusLabel from 'core/components/StatusLabel';

const PromotionList = ({ promotions }) => (
  <div className="promotion-list">
    <h3>Promotions</h3>
    {promotions.map(({ name, status, _id }) => (
      <div key={_id}>
        <CollectionIconLink
          relatedDoc={{ _id, name, collection: PROMOTIONS_COLLECTION }}
        />
        <StatusLabel status={status} collection={PROMOTIONS_COLLECTION} />
      </div>
    ))}
  </div>
);

export default PromotionList;
