import SimpleSchema from 'simpl-schema';
import { withProps } from 'recompose';
import uniqBy from 'lodash/uniqBy';

import {
  ORGANISATION_TYPES,
  ORGANISATIONS_COLLECTION,
} from 'core/api/constants';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import { insuranceInsert } from 'core/api/methods';
import InsuranceSchema from 'core/api/insurances/schemas/InsuranceSchema';

const getSchema = ({ borrowers, organisations }) =>
  new SimpleSchema({
    borrowerId: {
      type: String,
      allowedValues: borrowers.map(({ _id }) => _id),
      uniforms: {
        label: 'Assuré',
        transform: borrowerId =>
          borrowers.find(({ _id }) => _id === borrowerId).name,
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
  }).extend(
    InsuranceSchema.pick(
      'description',
      'premium',
      'singlePremium',
      'duration',
      'billingDate',
    ),
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
    model: insurance,
    insertInsurance: ({
      borrowerId,
      organisationId,
      insuranceProductId,
      description,
      premium,
      singlePremium,
      duration,
      billingDate,
    }) =>
      insuranceInsert.run({
        insuranceRequestId,
        borrowerId,
        organisationId,
        insuranceProductId,
        insurance: {
          description,
          premium,
          singlePremium,
          duration,
          billingDate: new Date(billingDate),
        },
      }),

    loading,
  };
});
