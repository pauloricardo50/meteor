// @flow
import React from 'react';
import Table from 'core/components/Table';
import ContactsTableContainer from './ContactsTableContainer';

type ContactsTableProps = {
  rows: Array<Object>,
  columnOptions: Array<Object>,
};

const ContactsTable = ({ rows, columnOptions }: ContactsTableProps) => (
  <Table columnOptions={columnOptions} rows={rows} clickable />
);

export default ContactsTableContainer(ContactsTable);
