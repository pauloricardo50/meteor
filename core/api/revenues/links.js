import Revenues from '.';
import { Loans, Organisations } from '..';

// If you want to use links, don't forget to import this file in 'core/api/links.js'

Revenues.addLinks({
  loan: {
    collection: Loans,
    inversedBy: 'revenues',
    type: 'one',
  },
  organisations: {
    collection: Organisations,
    field: 'organisationLinks',
    type: 'many',
    metadata: true,
  },
});
