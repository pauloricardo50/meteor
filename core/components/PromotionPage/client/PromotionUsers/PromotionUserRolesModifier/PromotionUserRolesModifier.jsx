import React from 'react';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { updatePromotionUserRoles } from '../../../../../api/promotions/methodDefinitions';
import { PROMOTION_USERS_ROLES } from '../../../../../api/promotions/promotionConstants';
import AutoForm from '../../../../AutoForm2';

const schema = new SimpleSchema({
  roles: { type: Array },
  'roles.$': {
    type: String,
    allowedValues: Object.values(PROMOTION_USERS_ROLES),
  },
});

const PromotionUserRolesModifier = ({ model, onSubmit }) => (
  <AutoForm
    schema={schema}
    model={model}
    onSubmit={onSubmit}
    submitFieldProps={{ showSubmitField: false }}
    autosave
  />
);

export default withProps(({ userId, roles: userRoles = [], promotionId }) => ({
  model: { roles: userRoles },
  onSubmit: ({ roles = [] }) =>
    updatePromotionUserRoles.run({ userId, promotionId, roles }),
}))(PromotionUserRolesModifier);
