import { Random } from 'meteor/random';
import { withProps } from 'recompose';

import {
  pushPropertyValue,
  pushBorrowerValue,
  pushLoanValue,
} from '../../api/methods/index';
import {
  PROPERTIES_COLLECTION,
  BORROWERS_COLLECTION,
} from '../../api/constants';

export default withProps(({ docId, collection }) => ({
  onSubmit: ({ label, category }) => {
    const object = {
      additionalDocuments: {
        id: Random.id(),
        label,
        category,
        requiredByAdmin: true,
      },
    };
    if (collection === PROPERTIES_COLLECTION) {
      return pushPropertyValue.run({ propertyId: docId, object });
    }

    if (collection === BORROWERS_COLLECTION) {
      return pushBorrowerValue.run({ borrowerId: docId, object });
    }

    return pushLoanValue.run({ loanId: docId, object });
  },
}));
