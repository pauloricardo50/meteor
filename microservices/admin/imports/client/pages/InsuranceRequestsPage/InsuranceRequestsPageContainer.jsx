import { withProps } from 'recompose';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/constants';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

export default withProps(() => {
  const { data: insuranceRequests } = useStaticMeteorData({
    query: INSURANCE_REQUESTS_COLLECTION,
    params: {
      name: 1,
      user: { name: 1 },
      status: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  });

  return { insuranceRequests };
});
