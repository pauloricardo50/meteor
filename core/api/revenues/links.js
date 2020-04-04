import InsuranceRequests from '../insuranceRequests';
import Insurances from '../insurances';
import LinkInitializer from '../links/LinkInitializer';
import Loans from '../loans/loans';
import Organisations from '../organisations';
import Users from '../users/users';
import Revenues from '.';

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
    },
    insuranceRequest: {
      collection: InsuranceRequests,
      inversedBy: 'revenues',
    },
    insurance: {
      collection: Insurances,
      inversedBy: 'revenues',
    },
  });
});
