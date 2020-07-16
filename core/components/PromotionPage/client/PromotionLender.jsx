import React from 'react';
import SimpleSchema from 'simpl-schema';

import { ORGANISATIONS_COLLECTION } from '../../../api/organisations/organisationConstants';
import { promotionUpdate } from '../../../api/promotions/methodDefinitions';
import AutoForm, { CustomAutoField } from '../../AutoForm2';

const schema = new SimpleSchema({
  lenderOrganisationLink: Object,
  'lenderOrganisationLink._id': {
    type: String,
    optional: true,
    customAllowedValues: {
      query: ORGANISATIONS_COLLECTION,
      params: {
        $filters: { lenderRulesCount: { $gte: 1 } },
        name: 1,
        $options: { sort: { name: 1 } },
      },
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
    model={{ lenderOrganisationLink: promotion.lenderOrganisationLink }}
    onSubmit={values => {
      const shouldSubmit =
        values.lenderOrganisationLink?._id &&
        values.lenderOrganisationLink._id !==
          promotion.lenderOrganisationLink?._id;

      if (shouldSubmit) {
        return promotionUpdate.run({
          promotionId: promotion._id,
          object: values,
        });
      }

      return Promise.reject();
    }}
  >
    <CustomAutoField name="lenderOrganisationLink._id" />
  </AutoForm>
);

export default PromotionLender;
