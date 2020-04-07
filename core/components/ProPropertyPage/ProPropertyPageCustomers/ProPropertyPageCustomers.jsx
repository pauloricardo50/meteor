import React from 'react';

import Select from '../../Select';
import Table from '../../Table';
import T from '../../Translation';
import PropertyCustomerAdder from '../PropertyCustomerAdder';
import ProPropertyPageCustomersContainer from './ProPropertyPageCustomersContainer';
import ProPropertyPublicLinkGenerator from './ProPropertyPublicLinkGenerator';

const ProPropertyPageCustomers = ({
  rows,
  columnOptions,
  property,
  permissions,
  loans,
  withAnonymous,
  setWithAnonymous,
}) => (
  <div className="card1 card-top customers-table">
    <span className="flex customers-table-header">
      <h2>
        <T id="ProPropertyPage.customersTable" />
      </h2>
      {permissions.canInviteCustomers && (
        <div className="flex-row center">
          <PropertyCustomerAdder propertyId={property._id} loans={loans} />
          <ProPropertyPublicLinkGenerator
            property={property}
            className="ml-16"
          />
        </div>
      )}
    </span>
    <Select
      label="Anonymes"
      value={withAnonymous}
      onChange={setWithAnonymous}
      options={[
        { id: true, label: 'Avec' },
        { id: false, label: 'Sans' },
      ]}
      className="mr-8"
    />
    <Table rows={rows} columnOptions={columnOptions} />
  </div>
);

export default ProPropertyPageCustomersContainer(ProPropertyPageCustomers);
