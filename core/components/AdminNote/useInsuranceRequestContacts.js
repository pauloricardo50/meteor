import { INSURANCE_REQUESTS_COLLECTION } from '../../api/insuranceRequests/insuranceRequestConstants';
import { useStaticMeteorData } from '../../hooks/useMeteorData';
import { getInsuranceRequestContacts } from './helpers';

const useInsuranceRequestContacts = insuranceRequestId => {
  const { loading, data: insuranceRequestWithContacts } = useStaticMeteorData({
    query: INSURANCE_REQUESTS_COLLECTION,
    params: {
      $filters: { _id: insuranceRequestId },

      user: {
        email: 1,
        phoneNumber: 1,
        name: 1,
        referredByUser: { email: 1, phoneNumber: 1, name: 1 },
        referredByOrganisation: { name: 1, emails: 1 },
      },
      borrowers: { email: 1, phoneNumber: 1, name: 1 },
      contacts: 1,
    },
    type: 'single',
  });
  const contacts = !loading
    ? getInsuranceRequestContacts(insuranceRequestWithContacts)
    : [];
  return { loading, contacts };
};

export default useInsuranceRequestContacts;
