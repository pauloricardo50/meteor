import Contacts from '../contacts';
import InsuranceRequests from '../insuranceRequests';
import Insurances from '../insurances';
import Lenders from '../lenders';
import Loans from '../loans/loans';
import Notifications from '../notifications';
import Organisations from '../organisations';
import Promotions from '../promotions';
import Users from '../users/users';
import Tasks from './tasks';

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
