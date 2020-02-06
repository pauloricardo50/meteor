//
import React from 'react';
import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import T from 'imports/core/components/Translation/';
import Irs10yDialogFormContainer from './Irs10yDialogFormContainer';

const InsertIrs10yDialogForm = ({ schema, insertIrs10y }) => (
  <AutoFormDialog
    schema={schema}
    model={{ date: new Date() }}
    onSubmit={insertIrs10y}
    buttonProps={{
      label: <T id="Irs10y.insert" />,
      raised: true,
      primary: true,
    }}
    title={<T id="Irs10y.insert" />}
  />
);

export default Irs10yDialogFormContainer(InsertIrs10yDialogForm);
