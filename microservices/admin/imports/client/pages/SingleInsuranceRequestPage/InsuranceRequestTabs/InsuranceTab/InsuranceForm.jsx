import React from 'react';
import SimpleSchema from 'simpl-schema';
import { withProps } from 'recompose';
import uniqBy from 'lodash/uniqBy';
import moment from 'moment';

import Box from 'core/components/Box';

import {
  ORGANISATION_TYPES,
  ORGANISATIONS_COLLECTION,
  INSURANCE_STATUS,
} from 'core/api/constants';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import { insuranceInsert, insuranceModify } from 'core/api/methods';
import InsuranceSchema from 'core/api/insurances/schemas/InsuranceSchema';
import InsuranceFormEndDateSetter from './InsuranceFormEndDateSetter';

const makeInsuranceMethod = ({
  insuranceRequestId,
  insurance = {},
  type = 'insert',
}) => ({
  status,
  borrowerId,
  organisationId,
  insuranceProductId,
  premium,
  premiumFrequency,
  startDate,
  endDate,
}) => {
  if (type === 'insert') {
    return insuranceInsert.run({
      insuranceRequestId,
      borrowerId,
      organisationId,
      insuranceProductId,
      insurance: {
        status,
        premium,
        startDate,
        endDate,
        premiumFrequency,
      },
    });
  }

  if (type === 'update') {
    return insuranceModify.run({
      insuranceId: insurance._id,
      borrowerId,
      organisationId,
      insuranceProductId,
      insurance: {
        status,
        premium,
        startDate,
        endDate,
        premiumFrequency,
      },
    });
  }
};

const getSchema = ({ borrowers, organisations }) =>
  new SimpleSchema({
    status: {
      type: String,
      allowedValues: Object.values(INSURANCE_STATUS),
      defaultValue: INSURANCE_STATUS.SUGGESTED,
    },
    borrowerId: {
      type: String,
      allowedValues: borrowers.map(({ _id }) => _id),
      uniforms: {
        label: 'Assuré',
        transform: borrowerId => {
          const borrower = borrowers
            .map((b, i) => ({ ...b, index: i }))
            .find(({ _id }) => _id === borrowerId);
          return borrower.name || `Assuré ${borrower.index + 1}`;
        },
        labelProps: { shrink: true },
        placeholder: null,
      },
    },
    organisationId: {
      type: String,
      allowedValues: organisations.map(({ _id }) => _id),
      uniforms: {
        transform: organisationId =>
          organisations.find(({ _id }) => _id === organisationId).name,
        labelProps: { shrink: true },
        label: 'Organisation',
        placeholder: null,
      },
    },
    type: {
      type: String,
      customAllowedValues: ({ organisationId }) => {
        const { insuranceProducts = [] } = organisations.find(
          ({ _id }) => _id === organisationId,
        );
        return uniqBy(insuranceProducts, 'type').map(({ type }) => type);
      },
      condition: ({ organisationId }) => !!organisationId,
      uniforms: {
        labelProps: { shrink: true },
        label: 'Type',
        placeholder: null,
      },
    },
    category: {
      type: String,
      customAllowedValues: ({ organisationId, type }) => {
        const { insuranceProducts = [] } = organisations.find(
          ({ _id }) => _id === organisationId,
        );
        return uniqBy(
          insuranceProducts.filter(
            ({ type: productType }) => type === productType,
          ),
          'category',
        ).map(({ category }) => category);
      },
      condition: ({ organisationId, type }) => !!organisationId && !!type,
      uniforms: {
        labelProps: { shrink: true },
        label: 'Catégorie',
        placeholder: null,
      },
    },
    insuranceProductId: {
      type: String,
      customAllowedValues: ({ organisationId, type, category }) => {
        const { insuranceProducts = [] } = organisations.find(
          ({ _id }) => _id === organisationId,
        );

        return insuranceProducts
          .filter(
            ({ type: insuranceType, category: insuranceCategory }) =>
              type === insuranceType && category === insuranceCategory,
          )
          .map(({ _id }) => _id);
      },
      condition: ({ organisationId, type, category }) =>
        !!organisationId && !!type && !!category,
      uniforms: {
        transform: productId => {
          const allProducts = organisations.reduce(
            (products, { insuranceProducts = [] }) => [
              ...products,
              ...insuranceProducts,
            ],
            [],
          );
          return allProducts.find(({ _id }) => _id === productId).name;
        },
        labelProps: { shrink: true },
        label: 'Produit',
        placeholder: null,
      },
    },
    endDateHelpers: {
      type: String,
      optional: true,
      uniforms: {
        render: InsuranceFormEndDateSetter,
        buttonProps: { raised: true, primary: true },
        label: '-> Retraite',
        func: ({ model, setError }) => {
          setError(undefined);
          const { borrowerId } = model;
          const borrower =
            borrowerId && borrowers.find(({ _id }) => _id === borrowerId);

          if (!borrower?.birthDate) {
            setError('Blablabla');
            return [];
          }

          const endDate = moment(borrower.birthDate)
            .add(30, 'year')
            .toDate();
          return [['endDate', endDate]];
        },
      },
    },
  }).extend(
    InsuranceSchema.pick('premium', 'premiumFrequency', 'startDate', 'endDate'),
  );

export default withProps(({ insuranceRequest, insurance = {} }) => {
  const { borrowers, _id: insuranceRequestId } = insuranceRequest;
  const { loading, data: organisations } = useStaticMeteorData({
    query: ORGANISATIONS_COLLECTION,
    params: {
      $filters: {
        type: {
          $in: [ORGANISATION_TYPES.INSURANCE, ORGANISATION_TYPES.PENSION_FUND],
        },
      },
      name: 1,
      insuranceProducts: {
        name: 1,
        type: 1,
        category: 1,
        revaluationFactor: 1,
      },
    },
  });

  return {
    schema: loading
      ? {}
      : getSchema({
          borrowers,
          organisations: organisations.filter(
            ({ insuranceProducts = [] }) => !!insuranceProducts.length,
          ),
        }),
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
    }),
    modifyInsurance: makeInsuranceMethod({
      insuranceRequestId,
      insurance,
      type: 'update',
    }),
    loading,
    layout: [
      {
        fields: ['status', 'borrowerId'],
        Component: Box,
        className: 'grid-row mb-32',
        title: <h3>Général</h3>,
      },
      {
        Component: Box,
        title: <h3>Assurance</h3>,
        layout: [
          {
            fields: [
              'organisationId',
              'type',
              'category',
              'insuranceProductId',
            ],
            Component: Box,
            className: 'grid-row mt-16',
            title: (
              <h3>
                <small>Produit</small>
              </h3>
            ),
          },
          {
            fields: ['premium', 'premiumFrequency'],
            Component: Box,
            className: 'grid-row mt-16',
            title: (
              <h3>
                <small>Prime</small>
              </h3>
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
    ],
  };
});
