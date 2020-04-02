import Organisations from '../organisations';
import LenderRules from '.';

LenderRules.addLinks({
  organisation: {
    field: 'organisationLink',
    type: 'one',
    metadata: true,
    collection: Organisations,
    denormalize: {
      field: 'organisationCache',
      body: { _id: 1, name: 1 },
    },
  },
});
