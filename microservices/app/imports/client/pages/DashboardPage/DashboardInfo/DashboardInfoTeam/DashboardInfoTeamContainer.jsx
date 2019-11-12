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
  const invitedByUser =
    invitedBy && promotionUsers.find(({ _id }) => _id === invitedBy);
  const organisation =
    invitedByUser &&
    invitedByUser.organisations &&
    !!invitedByUser.organisations.length &&
    invitedByUser.organisations[0];
  const title = organisation && organisation.$metadata.title;

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
          {title || 'Courtier immobilier'}
          <span className="secondary"> &bull; {promotionName}</span>
        </span>
      ),
      disableEdit: true,
    },
    ...contacts.map(obj => ({ ...obj, renderTitle: obj.title })),
  ]
    .filter(x => x)
    .reduce((allContacts, contact) => {
      if (allContacts.some(({ email }) => contact.email === email)) {
        return allContacts;
      }

      return [...allContacts, contact];
    }, []);
};

export default withProps(
  ({ loan: { _id: loanId, contacts = [], promotions, hasPromotion } }) => ({
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
  }),
);
