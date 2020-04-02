import React from 'react';
import { Helmet } from 'react-helmet';

import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/insuranceRequests/insuranceRequestConstants';
import collectionIcons from 'core/arrays/collectionIcons';
import Icon from 'core/components/Icon/Icon';
import T from 'core/components/Translation';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import InsuranceRequestsTable from '../../components/InsuranceRequestsTable/InsuranceRequestsTable';

const InsuranceRequestsPage = () => {
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
  return (
    <section className="card1 card-top insurance-requests-page">
      <Helmet>
        <title>Dossiers assurance</title>
      </Helmet>
      <h1 className="flex center-align">
        <Icon
          type={collectionIcons[INSURANCE_REQUESTS_COLLECTION]}
          style={{ marginRight: 8 }}
          size={32}
        />
        Dossiers assurance
      </h1>

      <InsuranceRequestsTable insuranceRequests={insuranceRequests} />
    </section>
  );
};

export default InsuranceRequestsPage;
