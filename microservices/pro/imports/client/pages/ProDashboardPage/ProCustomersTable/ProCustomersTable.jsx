// @flow
import React from 'react';

import Table from 'core/components/Table';
import ProCustomersTableContainer from './ProCustomersTableContainer';

type ProCustomersTableProps = {};

const ProCustomersTable = ({ rows, columnOptions }: ProCustomersTableProps) => (
  <div className="card1 card-top">
    <h2>Clients</h2>
    <Table rows={rows} columnOptions={columnOptions} />
  </div>
);

export default ProCustomersTableContainer(ProCustomersTable);
