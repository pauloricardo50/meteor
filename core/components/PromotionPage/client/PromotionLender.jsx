import React from 'react';
import SimpleSchema from 'simpl-schema';

import { adminOrganisations } from '../../../api/organisations/queries';
import { promotionUpdate } from '../../../api/promotions/methodDefinitions';
import AutoForm, { CustomAutoField } from '../../AutoForm2';

const schema = new SimpleSchema({
  lenderOrganisationLink: Object,
  'lenderOrganisationLink._id': {
    type: String,
    optional: true,
    customAllowedValues: {
      query: adminOrganisations,
      params: () => ({ hasRules: true, $body: { name: 1 } }),
      allowNull: true,
    },
    uniforms: {
      transform: lender => lender?.name || 'Pas de prêteur',
      labelProps: { shrink: true },
      label: 'Prêteur',
      placeholder: null,
    },
  },
});

const PromotionLender = ({ promotion }) => (
  <AutoForm
    autosave
    schema={schema}
    model={{ lenderOrganisationLink: promotion.lenderOrganisation }}
    onSubmit={values => {
      if (
        values.lenderOrganisationLink &&
        promotion.lenderOrganisation &&
        values.lenderOrganisationLink._id === promotion.lenderOrganisation._id
      ) {
        // FIXME: Don't submit this form on mount.. because of customAllowedValues
        return Promise.reject();
      }

      return promotionUpdate.run({
        promotionId: promotion._id,
        object: values,
      });
    }}
  >
    <CustomAutoField name="lenderOrganisationLink._id" />
  </AutoForm>
);

export default PromotionLender;
