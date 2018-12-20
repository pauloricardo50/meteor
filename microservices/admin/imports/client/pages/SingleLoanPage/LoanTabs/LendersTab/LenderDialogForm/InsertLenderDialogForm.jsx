// @flow
import React from 'react';
import AutoFormDialog from 'imports/core/components/AutoForm2/AutoFormDialog';
import T from 'core/components/Translation/';
import LenderDialogFormContainer from './LenderDialogFormContainer';

type InsertLenderDialogFormProps = {
  schema: Object,
  insertLender: Function,
};

const InsertLenderDialogForm = ({
  schema,
  insertLender,
}: InsertLenderDialogFormProps) => {
  return (
    <AutoFormDialog
      schema={schema}
      onSubmit={insertLender}
      buttonProps={{
        label: <T id="Lenders.insert" />,
        raised: true,
        primary: true,
      }}
    />
  );
};

export default LenderDialogFormContainer(InsertLenderDialogForm);
