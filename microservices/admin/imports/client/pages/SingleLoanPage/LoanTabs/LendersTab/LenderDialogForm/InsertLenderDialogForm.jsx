// @flow
import React from 'react';
import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import T from 'core/components/Translation/';
import LenderDialogFormContainer from './LenderDialogFormContainer';

type InsertLenderDialogFormProps = {
  schema: Object,
  insertLender: Function,
  autoFieldProps: Object,
};

const InsertLenderDialogForm = ({
  schema,
  insertLender,
  autoFieldProps,
}: InsertLenderDialogFormProps) => (
  <AutoFormDialog
    schema={schema}
    onSubmit={insertLender}
    buttonProps={{
      label: <T id="Lenders.insert" />,
      raised: true,
      primary: true,
    }}
    autoFieldProps={autoFieldProps}
  />
);

export default LenderDialogFormContainer(InsertLenderDialogForm);
