import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { withProps } from 'recompose';

import {
  ORGANISATIONS_COLLECTION,
  ORGANISATION_FEATURES,
} from 'core/api/organisations/organisationConstants';
import Box from 'core/components/Box';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import { getSchema, makeInsuranceMethod } from './insuranceFormHelpers';

const getLayout = type => [
  {
    fields: [type === 'update' && 'status', 'borrowerId'].filter(x => x),
    Component: Box,
    className: 'grid-row mb-32',
    title: <h5>Général</h5>,
  },
  {
    Component: Box,
    title: <h5>Assurance</h5>,
    layout: [
      {
        fields: [
          'organisationId',
          'type',
          'category',
          'insuranceProductId',
          'guaranteedCapital',
          'nonGuatanteedCapital',
          'deathCapital',
          'disabilityPension',
        ],
        Component: Box,
        className: 'grid-row mt-16',
        title: (
          <h4>
            <small>Produit</small>
          </h4>
        ),
      },
      {
        fields: ['premium', 'premiumFrequency'],
        Component: Box,
        className: 'grid-row mt-16',
        title: (
          <h4>
            <small>Prime</small>
          </h4>
        ),
        layout: [
          {
            fields: ['startDate', 'endDate', 'endDateHelpers'],
            className: 'grid-col',
            style: { alignItems: 'center', position: 'relative' },
          },
        ],
      },
    ],
    className: 'grid-row mb-32',
  },
];

export default withProps(({ insuranceRequest, insurance = {}, type }) => {
  const history = useHistory();
  const { borrowers, _id: insuranceRequestId } = insuranceRequest;
  const { loading, data: organisations } = useStaticMeteorData({
    query: ORGANISATIONS_COLLECTION,
    params: {
      $filters: { features: ORGANISATION_FEATURES.INSURANCE },
      name: 1,
      insuranceProducts: {
        name: 1,
        features: 1,
        category: 1,
        revaluationFactor: 1,
        maxProductionYears: 1,
      },
    },
  });

  const schema = useMemo(
    () =>
      loading
        ? {}
        : getSchema({
            borrowers,
            organisations: organisations.filter(
              ({ insuranceProducts = [] }) => !!insuranceProducts.length,
            ),
            type,
          }),
    [loading, borrowers, organisations],
  );

  return {
    schema,
    model: {
      ...insurance,
      borrowerId: insurance.borrower?._id,
      organisationId: insurance.organisation?._id,
      type: insurance.insuranceProduct?.type,
      category: insurance.insuranceProduct?.category,
      insuranceProductId: insurance.insuranceProduct?._id,
    },
    onSubmit: makeInsuranceMethod({
      insuranceRequestId,
      insurance,
      type,
      history,
    }),
    loading,
    layout: getLayout(type),
  };
});
