// @flow
import React from 'react';

import Table from '../../Table';
import ProPropertyPageCustomersContainer from './ProPropertyPageCustomersContainer';
import { Properties } from '../../../api';
import PropertyCustomerAdder from '../PropertyCustomerAdder';

type ProPropertyPageCustomersProps = {};

const ProPropertyPageCustomers = ({
  rows,
  columnOptions,
  property,
  permissions,
}: ProPropertyPageCustomersProps) => (
  <div className="card1 card-top customers-table">
    <span className="flex customers-table-header">
      <h2>Clients</h2>
      {permissions.canInviteCustomers && (
        <PropertyCustomerAdder propertyId={property._id} />
      )}
    </span>
    <Table rows={rows} columnOptions={columnOptions} />
  </div>
);

export default ProPropertyPageCustomersContainer(ProPropertyPageCustomers);
