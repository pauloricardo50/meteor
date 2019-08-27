// @flow
import React from 'react';

import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import PromotionUserPermissionsModifierContainer from './PromotionUserPermissionsModifierContainer';

type PromotionUserModifierProps = {
  promotionId: String,
  user: Object,
  schema: Object,
  model: Object,
};

const PromotionUserModifier = ({
  promotionId,
  user,
  schema,
  model,
  onSubmit,
}: PromotionUserModifierProps) => (
  <AutoFormDialog
    schema={schema}
    model={model}
    onSubmit={onSubmit}
    className="update-field"
    buttonProps={{
      label: 'Modifier',
      raised: true,
      primary: true,
    }}
  />
);

export default PromotionUserPermissionsModifierContainer(PromotionUserModifier);
