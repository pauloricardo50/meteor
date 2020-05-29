import React from 'react';
import { compose } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import {
  contact,
  lender,
  lenderRules,
  organisationUser,
} from 'core/api/fragments';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import withMatchParam from 'core/containers/withMatchParam';

export default compose(
  withMatchParam('organisationId'),
  Component => props => <Component {...props} key={props.organisationId} />,
  withSmartQuery({
    query: ORGANISATIONS_COLLECTION,
    params: ({ organisationId }) => ({
      // TODO: Remove unnecessary data
      $filters: { _id: organisationId },
      address: 1,
      address1: 1,
      address2: 1,
      canton: 1,
      city: 1,
      features: 1,
      logo: 1,
      name: 1,
      type: 1,
      zipCode: 1,
      tags: 1,
      country: 1,
      emails: 1,
      adminNote: 1,
      documents: 1,
      referredCustomers: { _id: 1 },
      insuranceProducts: {
        features: 1,
        name: 1,
        category: 1,
        revaluationFactor: 1,
        maxProductionYears: 1,
      },
      commissionRate: 1,
      productionRate: 1,
      commissionRates: { type: 1, rates: 1 },
      contacts: contact(),
      generatedRevenues: 1,
      generatedProductions: 1,
      lenderRules: lenderRules(),
      lenders: lender(),
      offers: 1,
      offerCount: 1,
      users: organisationUser(),
      enabledCommissionTypes: 1,
    }),
    queryOptions: { single: true },
    dataName: 'organisation',
  }),
);
