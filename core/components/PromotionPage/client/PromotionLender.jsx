// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import adminOrganisations from 'core/api/organisations/queries/adminOrganisations';
import { ORGANISATION_FEATURES } from 'core/api/constants';
import { promotionUpdate } from '../../../api';
import AutoForm, { CustomAutoField } from '../../AutoForm2';

type PromotionLenderProps = {};

const schema = new SimpleSchema({
  lenderOrganisationLink: Object,
  'lenderOrganisationLink._id': {
    type: String,
    optional: true,
    customAllowedValues: {
      query: adminOrganisations,
      params: () => ({
        features: ORGANISATION_FEATURES.LENDER,
        hasRules: true,
        $body: { name: 1, lenderRules: { _id: 1 } },
      }),
      allowNull: true,
    },
    uniforms: {
      transform: lender => (lender ? lender.name : 'Pas de prêteur'),
      labelProps: { shrink: true },
      label: 'Prêteur',
      placeholder: null,
    },
  },
});

const PromotionLender = ({ promotion }: PromotionLenderProps) => (
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

export default PromotionLender;
