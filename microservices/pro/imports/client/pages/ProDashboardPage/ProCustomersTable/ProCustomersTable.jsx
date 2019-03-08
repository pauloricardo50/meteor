// @flow
import React from 'react';

import Table from 'core/components/Table';
import ProCustomersTableContainer from './ProCustomersTableContainer';

type ProCustomersTableProps = {};

const ProCustomersTable = ({ rows, columnOptions }: ProCustomersTableProps) => (
  <>
    <h3 className="text-center">Clients</h3>
    <Table rows={rows} columnOptions={columnOptions} />
  </>
);

export default ProCustomersTableContainer(ProCustomersTable);
