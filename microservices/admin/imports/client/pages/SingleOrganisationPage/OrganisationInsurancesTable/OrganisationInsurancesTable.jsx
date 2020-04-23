import React from 'react';

import Table from 'core/components/Table';

import OrganisationInsurancesTableContainer from './OrganisationInsurancesTableContainer';

const OrganisationInsurancesTable = ({ columnOptions, rows }) => (
  <Table columnOptions={columnOptions} rows={rows} />
);

export default OrganisationInsurancesTableContainer(
  OrganisationInsurancesTable,
);
