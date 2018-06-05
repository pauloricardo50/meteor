import { Loans, Borrowers, Offers, Properties, Tasks, Users } from '..';
import { LOANS_COLLECTION } from '../loans/loanConstants';
import { BORROWERS_COLLECTION } from '../borrowers/borrowerConstants';
import { PROPERTIES_COLLECTION } from '../properties/propertyConstants';

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

export const getIdFieldNameFromCollection = collectionName =>
  ({
    [LOANS_COLLECTION]: 'loanId',
    [BORROWERS_COLLECTION]: 'borrowerId',
    [PROPERTIES_COLLECTION]: 'propertyId',
  }[collectionName]);

export const getCollectionNameFromIdField = idFieldName =>
  ({
    loanId: LOANS_COLLECTION,
    borrowerId: BORROWERS_COLLECTION,
    propertyId: PROPERTIES_COLLECTION,
  }[idFieldName]);
