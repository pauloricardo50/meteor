import { Meteor } from 'meteor/meteor';
import { withProps } from 'recompose';

import {
  loanSetAdminNote,
  loanRemoveAdminNote,
  insuranceRequestSetAdminNote,
  insuranceRequestRemoveAdminNote,
} from 'core/api/methods';
import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/insuranceRequests/insuranceRequestConstants';
import useLoanContacts from './useLoanContacts';
import useInsuranceRequestContacts from './useInsuranceRequestContacts';

const AUTHORIZED_COLLECTIONS = [
  LOANS_COLLECTION,
  INSURANCE_REQUESTS_COLLECTION,
];

export default withProps(({ collection, docId }) => {
  if (!AUTHORIZED_COLLECTIONS.includes(collection)) {
    throw new Meteor.Error(
      `Invalid collection ${collection}. Authorized collections: [${AUTHORIZED_COLLECTIONS.map(
        c => `'${c}'`,
      ).join(', ')}]`,
    );
  }

  let getContacts;
  let setAdminNote;
  let removeAdminNote;
  let methodParams;

  switch (collection) {
    case LOANS_COLLECTION:
      getContacts = useLoanContacts;
      setAdminNote = loanSetAdminNote;
      removeAdminNote = loanRemoveAdminNote;
      methodParams = { loanId: docId };
      break;
    case INSURANCE_REQUESTS_COLLECTION:
      getContacts = useInsuranceRequestContacts;
      setAdminNote = insuranceRequestSetAdminNote;
      removeAdminNote = insuranceRequestRemoveAdminNote;
      methodParams = { insuranceRequestId: docId };
      break;
    default:
      break;
  }

  return {
    getContacts,
    setAdminNote,
    removeAdminNote,
    methodParams,
  };
});
