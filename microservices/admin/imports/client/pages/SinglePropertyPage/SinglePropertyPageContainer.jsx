import React from 'react';
import { compose } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { formProperty } from 'core/api/fragments';
import { PROPERTIES_COLLECTION } from 'core/api/properties/propertyConstants';
import { proPropertyFormFields } from 'core/components/ProPropertyPage/ProPropertyForm/ProPropertyForm';

import { loanSummaryFragment } from '../../components/LoanSummaryList/LoanSummary';

export default compose(
  Component => props => (
    <Component
      {...props}
      key={props.propertyId || props.match.params.propertyId}
    />
  ),
  withSmartQuery({
    query: PROPERTIES_COLLECTION,
    params: ({ match, propertyId }) => ({
      $filters: { _id: propertyId || match.params.propertyId },
      ...formProperty(),
      ...proPropertyFormFields,
      address: 1,
      documents: 1,
      status: 1,
      totalValue: 1,
      userLinks: 1,
      users: { name: 1, email: 1, organisations: { name: 1 } },
      loans: loanSummaryFragment,
    }),
    queryOptions: { single: true },
    dataName: 'property',
  }),
);
