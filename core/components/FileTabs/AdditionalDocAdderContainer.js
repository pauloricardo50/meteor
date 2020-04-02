import { Random } from 'meteor/random';

import { withProps } from 'recompose';

import { BORROWERS_COLLECTION } from '../../api/borrowers/borrowerConstants';
import { pushBorrowerValue } from '../../api/borrowers/methodDefinitions';
import { pushLoanValue } from '../../api/loans/methodDefinitions';
import { pushPropertyValue } from '../../api/properties/methodDefinitions';
import { PROPERTIES_COLLECTION } from '../../api/properties/propertyConstants';

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
