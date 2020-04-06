import InsuranceRequests from '../insuranceRequests';
import Insurances from '../insurances';
import LinkInitializer from '../links/LinkInitializer';
import Loans from '../loans';
import Notifications from '../notifications';
import Users from '../users';
import Activities from './activities';

LinkInitializer.directInit(() => {
  Activities.addLinks({
    loan: {
      collection: Loans,
      field: 'loanLink',
      metadata: true,
    },
    user: {
      collection: Users,
      field: 'userLink',
      metadata: true,
    },
    createdByUser: {
      collection: Users,
      field: 'createdBy',
    },
    insuranceRequest: {
      collection: InsuranceRequests,
      field: 'insuranceRequestLink',
    },
    insurance: {
      collection: Insurances,
      field: 'insuranceLink',
    },
  });
});

LinkInitializer.inversedInit(() => {
  Activities.addLinks({
    notifications: {
      collection: Notifications,
      inversedBy: 'activity',
      autoremove: true,
    },
  });
});
