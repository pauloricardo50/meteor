import { createContainer, loanUpdate, compose } from 'core/api';
import { withState } from 'recompose';

export default compose(
  withState('isUpdating', 'setIsUpdating', false),
  createContainer(({ loan: { _id: loanId, contacts }, setIsUpdating }) => ({
    addContact: (newContact) => {
      setIsUpdating(true);
      return loanUpdate
        .run({ loanId, object: { contacts: [...contacts, newContact] } })
        .then(() => setIsUpdating(false));
    },
    removeContact: (contactName) => {
      setIsUpdating(true);
      return loanUpdate
        .run({
          loanId,
          object: {
            contacts: contacts.filter(({ name }) => name !== contactName),
          },
        })
        .then(() => setIsUpdating(false));
    },
    editContact: (oldName, editedContact) => {
      setIsUpdating(true);
      return loanUpdate
        .run({
          loanId,
          object: {
            contacts: [
              ...contacts.filter(({ name }) => name !== oldName),
              editedContact,
            ],
          },
        })
        .then(() => setIsUpdating(false));
    },
  })),
);
