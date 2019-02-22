// @flow
import React from 'react';

import Table from '../../Table';
import ProPropertyPageCustomersContainer from './ProPropertyPageCustomersContainer';

type ProPropertyPageCustomersProps = {};

const ProPropertyPageCustomers = ({
  rows,
  columnOptions,
}: ProPropertyPageCustomersProps) => (
  <div className="card1 card-top">
    <h2>Clients</h2>
    <Table rows={rows} columnOptions={columnOptions} />
  </div>
);

export default ProPropertyPageCustomersContainer(ProPropertyPageCustomers);
