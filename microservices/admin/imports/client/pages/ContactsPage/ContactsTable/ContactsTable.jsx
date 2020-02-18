import React from 'react';

import Table from 'core/components/Table';
import ContactsTableContainer from './ContactsTableContainer';
import InsertContactDialogForm from '../ContactDialogForm/InsertContactDialogForm';

const ContactsTable = ({ rows, columnOptions, insertContactModel }) => (
  <div>
    <InsertContactDialogForm model={insertContactModel} />
    <Table columnOptions={columnOptions} rows={rows} clickable />
  </div>
);

export default ContactsTableContainer(ContactsTable);
