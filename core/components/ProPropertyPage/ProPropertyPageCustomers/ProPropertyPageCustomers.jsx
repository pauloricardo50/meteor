// @flow
import React from 'react';

import Table from '../../Table';
import ProPropertyPageCustomersContainer from './ProPropertyPageCustomersContainer';
import PropertyCustomerAdder from '../PropertyCustomerAdder';
import T from '../../Translation';

type ProPropertyPageCustomersProps = {};

const ProPropertyPageCustomers = ({
  rows,
  columnOptions,
  property,
  permissions,
  loans,
}: ProPropertyPageCustomersProps) => (
  <div className="card1 card-top customers-table">
    <span className="flex customers-table-header">
      <h2>
        <T id="ProPropertyPage.customersTable" />
      </h2>
      {permissions.canInviteCustomers && (
        <PropertyCustomerAdder propertyId={property._id} loans={loans} />
      )}
    </span>
    <Table rows={rows} columnOptions={columnOptions} />
  </div>
);

export default ProPropertyPageCustomersContainer(ProPropertyPageCustomers);
