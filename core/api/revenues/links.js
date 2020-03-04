import LinkInitializer from '../links/LinkInitializer';
import Revenues from '.';
import { Loans, Organisations, Users, InsuranceRequests, Insurances } from '..';

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
  assignee: {
    collection: Users,
    field: 'assigneeLink',
    type: 'one',
    metadata: true,
  },
});

LinkInitializer.inversedInit(() => {
  Revenues.addLinks({
    loan: {
      collection: Loans,
      inversedBy: 'revenues',
      denormalize: { field: 'loanCache', body: { _id: 1, name: 1 } },
    },
    insuranceRequest: {
      collection: InsuranceRequests,
      inversedBy: 'revenues',
      denormalize: {
        field: 'insuranceRequestCache',
        body: { _id: 1, name: 1 },
      },
    },
    insurance: {
      collection: Insurances,
      inversedBy: 'revenues',
    },
  });
});
