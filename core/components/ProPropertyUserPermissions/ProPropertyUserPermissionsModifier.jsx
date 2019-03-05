// @flow
import React from 'react';
import AutoFormDialog from '../AutoForm2/AutoFormDialog';
import ProPropertyUserPermissionsContainer from './ProPropertyUserPermissionsContainer';

type ProPropertyUserPermissionsModifierProps = {};

const ProPropertyUserPermissionsModifier = ({
  schema,
  model,
  onSubmit,
}: ProPropertyUserPermissionsModifierProps) => (
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

export default ProPropertyUserPermissionsContainer(ProPropertyUserPermissionsModifier);
