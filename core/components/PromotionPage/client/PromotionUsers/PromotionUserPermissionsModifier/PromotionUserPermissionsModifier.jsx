import React from 'react';

import AutoFormDialog from '../../../../AutoForm2/AutoFormDialog';
import PromotionUserPermissionsModifierContainer from './PromotionUserPermissionsModifierContainer';

const PromotionUserModifier = ({
  user,
  schema,
  model,
  onSubmit,
  canModify,
}) => (
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
      size: 'small',
    }}
    disabled={!canModify}
  />
);

export default PromotionUserPermissionsModifierContainer(PromotionUserModifier);
