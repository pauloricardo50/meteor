import Revenues from '.';
import { Loans, Organisations } from '..';

Revenues.addLinks({
  loan: {
    collection: Loans,
    inversedBy: 'revenues',
    unique: true,
  },
  organisations: {
    collection: Organisations,
    field: 'organisationLinks',
    type: 'many',
    metadata: true,
  },
});
