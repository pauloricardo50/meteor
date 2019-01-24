// @flow
import React from 'react';

import Table from 'core/components/Table';
// import ContactsTableContainer from './ContactsTableContainer';
// import InsertContactDialogForm from '../ContactDialogForm/InsertContactDialogForm';
import OrganisationUsersTableContainer from './OrganisationUsersTableContainer';
import OrganisationUserAdder from '../OrganisationUserAdder/OrganisationUserAdder';

type OrganisationUsersTableProps = {
  rows: Array<Object>,
  columnOptions: Array<Object>,
  //   insertContactModel: Object,
};

const OrganisationUsersTable = ({
  rows,
  columnOptions,
  organisation,
}: OrganisationUsersTableProps) => (
  <div>
    <OrganisationUserAdder organisation={organisation} />
    {/* <InsertContactDialogForm model={insertContactModel} /> */}
    <Table columnOptions={columnOptions} rows={rows} clickable />
  </div>
);

export default OrganisationUsersTableContainer(OrganisationUsersTable);
