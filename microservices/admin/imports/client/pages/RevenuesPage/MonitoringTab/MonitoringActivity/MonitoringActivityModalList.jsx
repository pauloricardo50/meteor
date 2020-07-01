import React from 'react';
import groupBy from 'lodash/groupBy';

import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import StatusLabel from 'core/components/StatusLabel/StatusLabel';
import useMeteorData from 'core/hooks/useMeteorData';

import { collectionStatuses } from './monitoringActivityHelpers';

const MonitoringActivityModalList = ({ docIds, collection }) => {
  const { data } = useMeteorData({
    query: collection,
    params: {
      $filters: { _id: { $in: docIds } },
      status: 1,
      name: 1,
      borrowers: { name: 1 },
      borrower: { name: 1 },
    },
  });

  if (!data) {
    return null;
  }

  const order = collectionStatuses[collection];
  const grouped = groupBy(data, 'status');
  const sorted = Object.keys(grouped)
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
    .reduce((obj, group) => ({ ...obj, [group]: grouped[group] }), {});

  return (
    <div>
      {Object.keys(sorted).map(status => (
        <div key={status}>
          <StatusLabel
            status={status}
            collection={collection}
            className="mb-8"
          />

          <div>
            {sorted[status].map(doc => (
              <CollectionIconLink key={doc._id} relatedDoc={doc} />
            ))}
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default MonitoringActivityModalList;
