import React from 'react';
import { withProps } from 'recompose';

import { loanUpdate } from 'core/api';

export default withProps(({ loan: { _id: loanId, contacts = [], promotions, hasPromotion } }) => ({
  addContact: newContact =>
    loanUpdate.run({
      loanId,
      object: { contacts: [...contacts, newContact] },
    }),
  removeContact: contactName =>
    loanUpdate.run({
      loanId,
      object: {
        contacts: contacts.filter(({ name }) => name !== contactName),
      },
    }),
  editContact: (oldName, editedContact) =>
    loanUpdate.run({
      loanId,
      object: {
        contacts: [
          ...contacts.filter(({ name }) => name !== oldName),
          editedContact,
        ],
      },
    }),
  contacts: hasPromotion
    ? [
      ...promotions[0].contacts.map(contact => ({
        ...contact,
        renderTitle: (
          <span>
            {contact.title}
            <span className="secondary"> &bull; {promotions[0].name}</span>
          </span>
        ),
        disableEdit: true,
      })),
      ...contacts.map(obj => ({ ...obj, renderTitle: obj.title })),
    ]
    : contacts,
}));
