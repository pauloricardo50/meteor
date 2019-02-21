import React from 'react';
import { withProps } from 'recompose';

import { loanUpdate } from 'core/api';

const mergeContacts = ({ promotion, contacts }) => {
  const {
    contacts: promotionContacts = [],
    users: promotionUsers = [],
    name: promotionName,
    $metadata: { invitedBy },
  } = promotion;
  const invitedByUser = invitedBy && promotionUsers.find(({ _id }) => _id === invitedBy);

  return [
    ...promotionContacts.map(contact => ({
      ...contact,
      renderTitle: (
        <span>
          {contact.title}
          <span className="secondary"> &bull; {promotionName}</span>
        </span>
      ),
      disableEdit: true,
    })),
    invitedByUser && {
      ...invitedByUser,
      renderTitle: (
        <span>
          Courtier
          <span className="secondary"> &bull; {promotionName}</span>
        </span>
      ),
      disableEdit: true,
    },
    ...contacts.map(obj => ({ ...obj, renderTitle: obj.title })),
  ].filter(x => x);
};

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
    ? mergeContacts({ promotion: promotions[0], contacts })
    : contacts,
}));
