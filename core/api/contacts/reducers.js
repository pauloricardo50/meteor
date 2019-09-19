import addressReducer from '../reducers/addressReducer';
import Contacts from './contacts';
import { fullOffer } from '../fragments';

Contacts.addReducers({
  name: {
    body: {
      firstName: 1,
      lastName: 1,
    },
    reduce: ({ firstName, lastName }) => {
      const name = [firstName, lastName].filter(x => x).join(' ');
      return name.reverseFirstLastName();
    },
  },
  email: {
    body: {
      emails: 1,
    },
    reduce: ({ emails }) => emails && !!emails.length && emails[0].address,
  },
  phoneNumber: {
    body: {
      phoneNumbers: 1,
    },
    reduce: ({ phoneNumbers }) =>
      phoneNumbers && !!phoneNumbers.length && phoneNumbers[0],
  },
  offers: {
    body: {
      lenders: { offers: fullOffer() },
    },
    reduce: ({ lenders = [] }) => {
      const contactOffers = lenders.reduce(
        (allOffers, { offers = [] }) => [...allOffers, ...offers],
        [],
      );
      return contactOffers;
    },
  },
  ...addressReducer,
});
