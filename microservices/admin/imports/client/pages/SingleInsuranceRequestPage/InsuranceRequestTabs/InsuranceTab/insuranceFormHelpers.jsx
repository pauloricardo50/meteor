import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import SimpleSchema from 'simpl-schema';

import { INSURANCE_STATUS } from 'core/api/insurances/insuranceConstants';
import InsuranceSchema from 'core/api/insurances/schemas/InsuranceSchema';
import { insuranceInsert, insuranceModify } from 'core/api/methods';
import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';
import { formatMessage } from 'core/utils/intl';
import { createRoute } from 'core/utils/routerUtils';

import ADMIN_ROUTES from '../../../../../startup/client/adminRoutes';
import InsuranceFormEndDateSetter from './InsuranceFormEndDateSetter';

export const getSchema = ({ borrowers, organisations }) =>
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
    insuranceProductId: {
      type: String,
      customAllowedValues: ({ organisationId }) => {
        const { insuranceProducts = [] } = organisations.find(
          ({ _id }) => _id === organisationId,
        );

        return insuranceProducts.map(({ _id }) => _id);
      },
      condition: ({ organisationId }) => !!organisationId,
      uniforms: {
        transform: productId => {
          const allProducts = organisations.reduce(
            (products, { insuranceProducts = [] }) => [
              ...products,
              ...insuranceProducts,
            ],
            [],
          );
          const { name, features = [], category } = allProducts.find(
            ({ _id }) => _id === productId,
          );

          return (
            <ListItemText
              primary={name}
              secondary={
                <span>
                  <T id={`InsuranceProduct.category.${category}`} />
                  &nbsp;-&nbsp;
                  {features
                    .map(feature =>
                      formatMessage({
                        id: `InsuranceProduct.features.${feature}`,
                      }),
                    )
                    .join(' + ')}
                </span>
              }
            />
          );
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
            setError(
              'Vous devez choisir un emprunteur avec une date de naissance',
            );
            return [];
          }

          const endDate = Calculator.getRetirementDate(borrower).toDate();
          return [['endDate', endDate]];
        },
      },
    },
  }).extend(
    InsuranceSchema.pick('premium', 'premiumFrequency', 'startDate', 'endDate'),
  );

export const makeInsuranceMethod = ({
  insuranceRequestId,
  insurance = {},
  type = 'insert',
  history,
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
    return insuranceInsert
      .run({
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
      })
      .then(insuranceId =>
        history.push(
          createRoute(
            ADMIN_ROUTES.SINGLE_INSURANCE_REQUEST_PAGE_INSURANCES.path,
            {
              insuranceRequestId,
              tabId: insuranceId,
            },
          ),
        ),
      );
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
