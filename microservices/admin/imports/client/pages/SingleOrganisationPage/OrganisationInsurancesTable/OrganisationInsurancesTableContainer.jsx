import React from 'react';
import moment from 'moment';
import { withProps } from 'recompose';

import { INSURANCES_COLLECTION } from 'core/api/insurances/insuranceConstants';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import StatusLabel from 'core/components/StatusLabel';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

const columnOptions = [
  { id: 'createdAt', label: "Date d'ajout" },
  { id: 'insurance', label: 'Assurance' },
  { id: 'status', label: 'Statut' },
  { id: 'product', label: 'Produit' },
];

const mapInsurance = (insurance = {}) => {
  const {
    _id: insuranceId,
    status,
    createdAt,
    insuranceProduct,
    _collection,
  } = insurance;

  return {
    id: insuranceId,
    columns: [
      {
        raw: createdAt,
        label: moment(createdAt).format('DD.MM.YYYY'),
      },
      {
        raw: insurance,
        label: <CollectionIconLink relatedDoc={insurance} />,
      },
      {
        raw: status,
        label: <StatusLabel status={status} collection={_collection} />,
      },
      {
        raw: insuranceProduct?.name,
        label: insuranceProduct?.name,
      },
    ],
  };
};

export default withProps(({ organisationId }) => {
  const { data: insurances, loading } = useStaticMeteorData({
    query: INSURANCES_COLLECTION,
    params: {
      $filters: { 'organisationLink._id': organisationId },
      status: 1,
      insuranceProduct: { name: 1 },
      createdAt: 1,
      insuranceRequest: { _id: 1 },
      borrower: { name: 1 },
    },
  });

  return {
    columnOptions,
    rows: loading ? [] : insurances.map(mapInsurance),
  };
});
