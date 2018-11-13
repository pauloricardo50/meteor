import { Random } from 'meteor/random';
import { withProps } from 'recompose';

import { pushPropertyValue, pushBorrowerValue } from '../../api/methods/index';
import { PROPERTIES_COLLECTION } from '../../api/constants';

export default withProps(({ docId, collection }) => ({
  onSubmit: ({ label }) => {
    const object = {
      additionalDocuments: { id: Random.id(), label, requiredByAdmin: true },
    };
    if (collection === PROPERTIES_COLLECTION) {
      return pushPropertyValue.run({ propertyId: docId, object });
    }

    return pushBorrowerValue.run({ borrowerId: docId, object });
  },
}));
