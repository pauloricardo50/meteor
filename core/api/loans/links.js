import Activities from '../activities/activities';
import Borrowers from '../borrowers/index';
import InsuranceRequests from '../insuranceRequests/index';
import Lenders from '../lenders/index';
import LinkInitializer from '../links/LinkInitializer';
import Organisations from '../organisations/index';
import PromotionLots from '../promotionLots/index';
import PromotionOptions from '../promotionOptions/index';
import Promotions from '../promotions/index';
import Properties from '../properties/index';
import Revenues from '../revenues/index';
import Tasks from '../tasks/tasks';
import Users from '../users/users';
import Loans from './loans';

export const userCache = {
  _id: 1,
  firstName: 1,
  lastName: 1,
  referredByOrganisationLink: 1,
  referredByUserLink: 1,
  assignedEmployeeCache: 1,
};

export const lendersCache = {
  status: 1,
  contactLink: 1,
  organisationLink: 1,
  offersCache: 1,
};

export const tasksCache = {
  createdAt: 1,
  dueAt: 1,
  status: 1,
  title: 1,
  isPrivate: 1,
  assigneeLink: 1,
};

LinkInitializer.directInit(() => {
  Loans.addLinks({
    activities: {
      inversedBy: 'loan',
      collection: Activities,
      autoremove: true,
    },
    borrowers: {
      field: 'borrowerIds',
      collection: Borrowers,
      type: 'many',
    },
    promotions: {
      field: 'promotionLinks',
      collection: Promotions,
      type: 'many',
      metadata: true,
    },
    promotionOptions: {
      field: 'promotionOptionLinks',
      collection: PromotionOptions,
      type: 'many',
      unique: true,
      metadata: true,
      autoremove: true,
    },
    properties: {
      field: 'propertyIds',
      collection: Properties,
      type: 'many',
    },
    revenues: {
      field: 'revenueLinks',
      collection: Revenues,
      type: 'many',
      unique: true,
    },
    user: {
      field: 'userId',
      collection: Users,
      type: 'one',
      denormalize: {
        field: 'userCache',
        body: userCache,
      },
    },
    financedPromotion: {
      field: 'financedPromotionLink',
      type: 'one',
      metadata: true,
      unique: true,
      collection: Promotions,
    },
    // No inversed link
    selectedLenderOrganisation: {
      field: 'selectedLenderOrganisationLink',
      type: 'one',
      metadata: true,
      collection: Organisations,
    },
    assignees: {
      field: 'assigneeLinks',
      collection: Users,
      type: 'many',
      metadata: true,
    },
    insuranceRequests: {
      field: 'insuranceRequestLinks',
      collection: InsuranceRequests,
      type: 'many',
      metadata: true,
      unique: true,
    },
  });
});

LinkInitializer.inversedInit(() => {
  Loans.addLinks({
    attributedPromotionLots: {
      collection: PromotionLots,
      inversedBy: 'attributedTo',
    },
    lenders: {
      collection: Lenders,
      inversedBy: 'loan',
      unique: true,
      autoremove: true,
      denormalize: {
        field: 'lendersCache',
        body: lendersCache,
      },
    },
    tasks: {
      collection: Tasks,
      inversedBy: 'loan',
      autoremove: true,
      denormalize: {
        field: 'tasksCache',
        body: tasksCache,
      },
    },
  });
});
