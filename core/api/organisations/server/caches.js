import LenderRules from '../../lenderRules';
import Revenues from '../../revenues';
import Users from '../../users';
import OrganisationService from './OrganisationService';

OrganisationService.cacheCount(
  {
    collection: LenderRules,
    referenceField: 'organisationLink._id',
    cacheField: 'lenderRulesCount',
  },
  // { loanCount: { $exists: false } },
);

OrganisationService.cacheCount(
  {
    collection: Users,
    referenceField: 'referredByOrganisationLink',
    cacheField: 'referredUsersCount',
  },
  // { referredUsersCount: { $exists: false } },
);

OrganisationService.cacheCount(
  {
    collection: Revenues,
    referenceField: 'sourceOrganisationLink._id',
    cacheField: 'revenuesCount',
  },
  // { revenuesCount: { $exists: false } },
);

// Let's you easily query the main organisation of a user
OrganisationService.cacheField(
  {
    fields: ['userLinks'],
    cacheField: 'mainUserLinks',
    transform: ({ userLinks = [] }) => userLinks.filter(({ isMain }) => isMain),
  },
  // { mainUserLinks: { $exists: false } },
);
