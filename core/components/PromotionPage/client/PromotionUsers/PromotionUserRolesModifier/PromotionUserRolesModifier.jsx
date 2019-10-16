// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';
import { withProps } from 'recompose';

import { PROMOTION_USERS_ROLES } from 'core/api/constants';
import { updatePromotionUserRoles } from 'core/api/promotions/methodDefinitions';
import AutoForm from 'core/components/AutoForm2';

type PromotionUserRolesModifierProps = {
  schema: Object,
  model: Object,
  onSubmit: Function,
};

const PromotionUserRolesModifier = ({
  schema,
  model,
  onSubmit,
}: PromotionUserRolesModifierProps) => (
  <AutoForm
    schema={schema}
    model={model}
    onSubmit={onSubmit}
    submitFieldProps={{ showSubmitField: false }}
    autosave
  />
);

export default withProps(({ userId, roles: userRoles = [], promotionId }) => ({
  schema: new SimpleSchema({
    roles: { type: Array },
    'roles.$': {
      type: String,
      allowedValues: Object.values(PROMOTION_USERS_ROLES),
    },
  }),
  model: { roles: userRoles },
  onSubmit: ({ roles = [] }) =>
    updatePromotionUserRoles.run({ userId, promotionId, roles }),
}))(PromotionUserRolesModifier);
