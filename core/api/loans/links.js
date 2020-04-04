import Activities from '../activities/activities';
import Borrowers from '../borrowers';
import InsuranceRequests from '../insuranceRequests';
import Lenders from '../lenders';
import LinkInitializer from '../links/LinkInitializer';
import Organisations from '../organisations';
import PromotionLots from '../promotionLots';
import PromotionOptions from '../promotionOptions';
import Promotions from '../promotions';
import Properties from '../properties';
import Revenues from '../revenues';
import Tasks from '../tasks/tasks';
import Users from '../users/users';
import Loans from './loans';

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
    },
    tasks: {
      collection: Tasks,
      inversedBy: 'loan',
      autoremove: true,
    },
  });
});
