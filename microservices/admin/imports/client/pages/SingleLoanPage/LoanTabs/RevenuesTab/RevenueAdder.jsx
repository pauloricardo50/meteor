// @flow
import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import RevenueDialogFormContainer from './RevenueDialogFormContainer';

type RevenueAdderProps = {
  schema: Object,
  insertRevenue: Function,
};

const RevenueAdder = ({ schema, insertRevenue }: RevenueAdderProps) => (
  <AutoFormDialog
    schema={schema}
    onSubmit={insertRevenue}
    buttonProps={{ label: 'Insérer un revenu', raised: true, primary: true }}
    title="Insérer un revenu"
  />
);

export default RevenueDialogFormContainer(RevenueAdder);
