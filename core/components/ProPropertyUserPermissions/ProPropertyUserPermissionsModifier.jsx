import React from 'react';

import AutoFormDialog from '../AutoForm2/AutoFormDialog';
import T from '../Translation';
import ProPropertyUserPermissionsContainer from './ProPropertyUserPermissionsContainer';

const ProPropertyUserPermissionsModifier = ({ schema, model, onSubmit }) => (
  <AutoFormDialog
    schema={schema}
    model={model}
    onSubmit={onSubmit}
    className="update-field"
    buttonProps={{
      label: <T id="general.modify" />,
      raised: true,
      primary: true,
    }}
  />
);

export default ProPropertyUserPermissionsContainer(
  ProPropertyUserPermissionsModifier,
);
