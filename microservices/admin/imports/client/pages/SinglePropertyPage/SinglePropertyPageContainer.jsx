import React from 'react';
import { compose } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { adminProperties } from 'core/api/properties/queries';

export default compose(
  Component => props => (
    <Component
      {...props}
      key={props.propertyId || props.match.params.propertyId}
    />
  ),
  withSmartQuery({
    query: adminProperties,
    params: ({ match, propertyId }) => ({
      _id: propertyId || match.params.propertyId,
    }),
    queryOptions: { single: true },
    dataName: 'property',
  }),
);
