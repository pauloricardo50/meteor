import React from 'react';
import { Helmet } from 'react-helmet';

import T from 'core/components/Translation';
import Icon from 'core/components/Icon/Icon';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/constants';
import collectionIcons from 'core/arrays/collectionIcons';
import InsuranceRequestsPageContainer from './InsuranceRequestsPageContainer';
import InsuranceRequestsTable from '../../components/InsuranceRequestsTable/InsuranceRequestsTable';

const InsuranceRequestsPage = props => (
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

    <InsuranceRequestsTable {...props} />
  </section>
);

export default InsuranceRequestsPageContainer(InsuranceRequestsPage);
