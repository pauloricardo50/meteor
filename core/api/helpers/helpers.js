import { Loans, Borrowers, Offers, Properties, Tasks, Users } from '..';

export const getDocFromCollection = (collectionName, docId) => {
  let collection;
  switch (collectionName) {
  case 'loans':
    collection = Loans;
    break;
  case 'borrowers':
    collection = Borrowers;
    break;
  case 'properties':
    collection = Properties;
    break;
  case 'offers':
    collection = Offers;
    break;
  case 'tasks':
    collection = Tasks;
    break;
  case 'users':
    collection = Users;
    break;
  default:
    break;
  }

  return collection.findOne(docId);
};
