// @flow
import React from 'react';

import Table from 'core/components/Table';
import ProCustomersTableContainer from './ProCustomersTableContainer';
import ProCustomerAdder from './ProCustomerAdder';

type ProCustomersTableProps = {};

const ProCustomersTable = ({
  rows,
  columnOptions,
  propertyIds,
  promotionIds,
  currentUser,
}: ProCustomersTableProps) => (
  <>
    <h3 className="text-center">Clients</h3>
    <ProCustomerAdder currentUser={currentUser} />
    <Table rows={rows} columnOptions={columnOptions} />
  </>
);

export default ProCustomersTableContainer(ProCustomersTable);
