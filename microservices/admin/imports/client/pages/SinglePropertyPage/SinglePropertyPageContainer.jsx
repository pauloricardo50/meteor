import React from 'react';
import { compose } from 'recompose';

import adminProperty from 'core/api/properties/queries/adminProperty';
import mergeFilesWithQuery from 'core/api/files/mergeFilesWithQuery';
import propertyFiles from 'core/api/properties/queries/propertyFiles';
import { PROPERTY_CATEGORY } from 'core/api/constants';
import { withSmartQuery } from 'core/api';

export default compose(
  withSmartQuery({
    query: adminProperty,
    params: ({ match, propertyId }) => ({
      propertyId: propertyId || match.params.propertyId,
    }),
    queryOptions: { reactive: true, single: true },
    dataName: 'property',
  }),
  Component => (props) => {
    // Only fetch files for PRO properties
    if (props.property && props.property.category === PROPERTY_CATEGORY.PRO) {
      const WrappedComponent = mergeFilesWithQuery(
        propertyFiles,
        ({ property: { _id: propertyId } }) => ({ propertyId }),
        'property',
      )(Component);
      return <WrappedComponent {...props} />;
    }

    return <Component {...props} />;
  },
);
