// @flow
import React from 'react';
import Table from 'core/components/Table';
import ContactsTableContainer from './ContactsTableContainer';
import InsertContactDialogForm from '../ContactDialogForm/InsertContactDialogForm';

type ContactsTableProps = {
  rows: Array<Object>,
  columnOptions: Array<Object>,
  insertContactModel: Object,
};

const ContactsTable = ({ rows, columnOptions, insertContactModel }: ContactsTableProps) => (
  <div>

    <InsertContactDialogForm model={insertContactModel} />
    <Table columnOptions={columnOptions} rows={rows} clickable />

  </div>
);

export default ContactsTableContainer(ContactsTable);
