import React from 'react';

import Table from 'core/components/Table';

import InsertContactDialogForm from '../ContactDialogForm/InsertContactDialogForm';
import ContactsTableContainer from './ContactsTableContainer';

const ContactsTable = ({ rows, columnOptions, insertContactModel }) => (
  <div>
    <InsertContactDialogForm model={insertContactModel} />
    <Table columnOptions={columnOptions} rows={rows} clickable />
  </div>
);

export default ContactsTableContainer(ContactsTable);
