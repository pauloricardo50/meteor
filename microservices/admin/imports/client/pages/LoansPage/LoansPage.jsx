import React from 'react';
import { Helmet } from 'react-helmet';

import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import collectionIcons from 'core/arrays/collectionIcons';
import Icon from 'core/components/Icon/Icon';
import T from 'core/components/Translation';

import AllLoansTable from './AllLoansTable';

const LoansPage = () => (
  <section className="card1 card-top loans-page">
    <Helmet>
      <title>Hypothèques</title>
    </Helmet>
    <h1 className="flex center-align">
      <Icon
        type={collectionIcons[LOANS_COLLECTION]}
        style={{ marginRight: 8 }}
        size={32}
      />
      <T id="LoansPage.title" />
    </h1>

    <AllLoansTable />
  </section>
);

export default LoansPage;
