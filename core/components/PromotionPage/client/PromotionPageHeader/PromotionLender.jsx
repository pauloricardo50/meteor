// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import { adminOrganisations } from '../../../../api/organisations/queries';
import { ORGANISATION_FEATURES } from '../../../../api/constants';
import { promotionUpdate } from '../../../../api';
import AutoForm, { CustomAutoField } from '../../../AutoForm2';

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

const PromotionLender = ({ promotion }: PromotionLenderProps) => {
  console.log('model', promotion.lenderOrganisation);

  return (
    <AutoForm
      autosave
      schema={schema}
      model={{ lenderOrganisationLink: promotion.lenderOrganisation }}
      onSubmit={(values) => {
        console.log('submit form!');

        return promotionUpdate.run({
          promotionId: promotion._id,
          object: values,
        });
      }}
    >
      <CustomAutoField name="lenderOrganisationLink._id" />
    </AutoForm>
  );
};

export default PromotionLender;
