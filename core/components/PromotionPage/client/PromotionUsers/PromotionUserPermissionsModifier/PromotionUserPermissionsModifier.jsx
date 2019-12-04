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
  canModify,
}: PromotionUserModifierProps) => (
  <AutoFormDialog
    schema={schema}
    model={model}
    onSubmit={onSubmit}
    className="update-field"
    title={`Permissions de ${user.name}`}
    buttonProps={{
      label: canModify ? 'Modifier' : 'Voir',
      raised: true,
      primary: true,
    }}
    disabled={!canModify}
  />
);

export default PromotionUserPermissionsModifierContainer(PromotionUserModifier);
