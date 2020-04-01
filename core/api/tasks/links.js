import Tasks from './tasks';
import { Users, Loans, InsuranceRequests, Insurances } from '..';
import Notifications from '../notifications';
import Promotions from '../promotions';
import Organisations from '../organisations';
import Lenders from '../lenders';
import Contacts from '../contacts';

Tasks.addLinks({
  assignee: {
    field: 'assigneeLink',
    collection: Users,
    type: 'one',
    metadata: true,
  },
  loan: {
    field: 'loanLink',
    collection: Loans,
    type: 'one',
    metadata: true,
  },
  user: {
    field: 'userLink',
    collection: Users,
    type: 'one',
    metadata: true,
  },
  promotion: {
    field: 'promotionLink',
    collection: Promotions,
    type: 'one',
    metadata: true,
  },
  organisation: {
    field: 'organisationLink',
    collection: Organisations,
    type: 'one',
    metadata: true,
  },
  lender: {
    field: 'lenderLink',
    collection: Lenders,
    type: 'one',
    metadata: true,
  },
  notifications: {
    collection: Notifications,
    inversedBy: 'task',
    autoremove: true,
  },
  contact: {
    field: 'contactLink',
    collection: Contacts,
    type: 'one',
    metadata: true,
  },
  insuranceRequest: {
    field: 'insuranceRequestLink',
    collection: InsuranceRequests,
    type: 'one',
    metadata: true,
  },
  insurance: {
    field: 'insuranceLink',
    collection: Insurances,
    type: 'one',
    metadata: true,
  },
});
