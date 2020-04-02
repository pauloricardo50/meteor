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

const layout = [
  {
    fields: ['status', 'borrowerId'],
    Component: Box,
    className: 'grid-row mb-32',
    title: <h4>Général</h4>,
  },
  {
    Component: Box,
    title: <h4>Assurance</h4>,
    layout: [
      {
        fields: ['organisationId', 'type', 'category', 'insuranceProductId'],
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

export default withProps(({ insuranceRequest, insurance = {} }) => {
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
    insertInsurance: makeInsuranceMethod({
      insuranceRequestId,
      insurance,
      type: 'insert',
      history,
    }),
    modifyInsurance: makeInsuranceMethod({
      insuranceRequestId,
      insurance,
      type: 'update',
      history,
    }),
    loading,
    layout,
  };
});
