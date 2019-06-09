// @flow
import React from 'react';

import StatusLabel from 'core/components/StatusLabel';
import { PROPERTIES_COLLECTION } from 'core/api/constants';
import { CollectionIconLink } from 'core/components/IconLink';

type ProPropertiesListProps = {};

const ProPropertiesList = ({ properties }: ProPropertiesListProps) => (
  <div className="pro-properties-list">
    <h3>Biens immobliers</h3>
    {properties.map(({ address1, status, _id }) => (
      <div key={_id}>
        <CollectionIconLink
          relatedDoc={{ _id, address1, collection: PROPERTIES_COLLECTION }}
        />
        <StatusLabel status={status} collection={PROPERTIES_COLLECTION} />
      </div>
    ))}
  </div>
);

export default ProPropertiesList;
