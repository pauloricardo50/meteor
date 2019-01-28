import LenderRules from '.';
import { Organisations } from '..';

LenderRules.addLinks({
  organisation: {
    field: 'organisationLink',
    type: 'one',
    metadata: true,
    unique: true,
    collection: Organisations,
  },
});
