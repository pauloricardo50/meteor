import { Random } from 'meteor/random';
import { withProps } from 'recompose';

import { PROPERTIES_COLLECTION } from 'core/api/properties/propertyConstants';
import { BORROWERS_COLLECTION } from 'core/api/borrowers/borrowerConstants';
import {
  pushPropertyValue,
  pushBorrowerValue,
  pushLoanValue,
} from '../../api/methods/index';

export default withProps(({ docId, collection }) => ({
  onSubmit: ({ label, category, tooltip }) => {
    const object = {
      additionalDocuments: {
        id: Random.id(),
        label,
        category,
        requiredByAdmin: true,
        tooltip,
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
