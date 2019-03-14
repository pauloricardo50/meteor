// @flow
import React from 'react';

import Table from 'core/components/Table';
import ProOrganisationUsersTableContainer from './ProOrganisationUsersTableContainer';

type ProOrganisationUsersTableProps = {};

const ProOrganisationUsersTable = ({
  rows,
  columnOptions,
}: ProOrganisationUsersTableProps) => (
  <Table rows={rows} columnOptions={columnOptions} />
);

export default ProOrganisationUsersTableContainer(ProOrganisationUsersTable);
