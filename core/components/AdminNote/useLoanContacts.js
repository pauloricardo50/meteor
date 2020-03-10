import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import { adminLoans } from 'core/api/loans/queries';

import { getLoanContacts } from './helpers';

const useLoanContacts = loanId => {
  const { loading, data: loanWithContacts } = useStaticMeteorData({
    query: adminLoans,
    params: {
      _id: loanId,
      $body: {
        user: {
          email: 1,
          phoneNumber: 1,
          name: 1,
          referredByUser: { email: 1, phoneNumber: 1, name: 1 },
          referredByOrganisation: { name: 1, emails: 1 },
        },
        borrowers: { email: 1, phoneNumber: 1, name: 1 },
        promotions: { _id: 1, users: { name: 1, email: 1, phoneNumber: 1 } },
        contacts: 1,
        lenders: {
          organisation: { name: 1 },
          contact: { name: 1, email: 1, phoneNumber: 1 },
        },
      },
    },
    type: 'single',
  });
  const contacts = !loading ? getLoanContacts(loanWithContacts) : [];
  return { loading, contacts };
};

export default useLoanContacts;
