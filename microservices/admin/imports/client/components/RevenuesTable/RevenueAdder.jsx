// @flow
import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import Box from 'core/components/Box';
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
    layout={[
      {
        Component: Box,
        title: <h4>Général</h4>,
        className: 'mb-32',
        layout: [
          { className: 'grid-col', fields: ['amount', 'type', 'secondaryType'] },
          'description',
        ],
      },
      {
        Component: Box,
        title: <h4>Payé par</h4>,
        className: 'mb-32 grid-2',
        fields: ['expectedAt', 'sourceOrganisationLink._id'],
      },
      {
        Component: Box,
        title: <h4>Commissions à payer</h4>,
        fields: ['organisationLinks'],
      },
    ]}
  />
);

export default RevenueDialogFormContainer(RevenueAdder);
