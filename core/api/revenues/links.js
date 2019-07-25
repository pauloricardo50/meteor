import LinkInitializer from '../links/LinkInitializer';
import Revenues from '.';
import { Loans, Organisations } from '..';

Revenues.addLinks({
  organisations: {
    collection: Organisations,
    field: 'organisationLinks',
    type: 'many',
    metadata: true,
  },
  sourceOrganisation: {
    collection: Organisations,
    field: 'sourceOrganisationLink',
    type: 'one',
    metadata: true,
  },
});

LinkInitializer.inversedInit(() => {
  Revenues.addLinks({
    loan: {
      collection: Loans,
      inversedBy: 'revenues',
      denormalize: {
        field: 'loanCache',
        body: { _id: 1, name: 1 },
      },
    },
  });
});
