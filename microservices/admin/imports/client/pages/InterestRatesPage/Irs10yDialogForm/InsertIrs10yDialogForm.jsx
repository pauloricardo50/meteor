import React from 'react';
import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import T from 'core/components/Translation/';
import Icon from 'core/components/Icon';
import Irs10yDialogFormContainer from './Irs10yDialogFormContainer';

const InsertIrs10yDialogForm = ({ schema, insertIrs10y }) => (
  <AutoFormDialog
    schema={schema}
    model={{ date: new Date() }}
    onSubmit={insertIrs10y}
    buttonProps={{
      label: 'Taux IRS10',
      raised: true,
      primary: true,
      icon: <Icon type="add" />,
      className: 'mt-16',
    }}
    title={<T id="Irs10y.insert" />}
  />
);

export default Irs10yDialogFormContainer(InsertIrs10yDialogForm);
