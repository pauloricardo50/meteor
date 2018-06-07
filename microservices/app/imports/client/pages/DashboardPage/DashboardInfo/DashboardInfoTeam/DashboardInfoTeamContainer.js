import { createContainer, loanUpdate } from 'core/api';

export default createContainer(({ loan: { _id: loanId, contacts } }) => ({
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
}));
