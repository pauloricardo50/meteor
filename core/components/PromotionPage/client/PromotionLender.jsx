// @flow
import React from 'react';
import { compose, withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import query from 'core/api/organisations/queries/adminOrganisations';
import { ORGANISATION_FEATURES } from 'core/api/constants';
import { withSmartQuery, promotionUpdate } from '../../../api';
import AutoForm, { CustomAutoField } from '../../AutoForm2';

type PromotionLenderProps = {};

const getSchema = lenders =>
  new SimpleSchema({
    lenderOrganisationLink: Object,
    'lenderOrganisationLink._id': {
      type: String,
      optional: true,
      allowedValues: [null, ...lenders.map(({ _id }) => _id)],
      uniforms: {
        transform: lenderId =>
          (lenderId
            ? lenders.find(({ _id }) => lenderId === _id).name
            : 'Pas de prêteur'),
        labelProps: { shrink: true },
        label: 'Prêteur',
        placeholder: null,
      },
    },
  });

const PromotionLender = ({ schema, promotion }: PromotionLenderProps) => (
  <AutoForm
    autosave
    schema={schema}
    model={{
      lenderOrganisationLink: promotion.lenderOrganisation
        ? promotion.lenderOrganisation
        : null,
    }}
    onSubmit={values =>
      promotionUpdate.run({ promotionId: promotion._id, object: values })
    }
  >
    <CustomAutoField name="lenderOrganisationLink._id" />
  </AutoForm>
);

export default compose(
  withSmartQuery({
    query,
    params: { features: ORGANISATION_FEATURES.LENDER, $body: { name: 1 } },
    dataName: 'lenders',
    smallLoader: true,
  }),
  withProps(({ lenders }) => ({ schema: getSchema(lenders) })),
)(PromotionLender);
