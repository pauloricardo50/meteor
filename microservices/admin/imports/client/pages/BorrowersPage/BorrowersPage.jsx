import React from 'react';
import { Helmet } from 'react-helmet';

import { BORROWERS_COLLECTION } from 'core/api/borrowers/borrowerConstants';
import collectionIcons from 'core/arrays/collectionIcons';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';

import BorrowersTable from './BorrowersTable';

const BorrowersPage = props => (
  <section className="borrowers-page">
    <Helmet>
      <title>Emprunteurs</title>
    </Helmet>
    <h1 className="flex center-align">
      <Icon
        type={collectionIcons[BORROWERS_COLLECTION]}
        style={{ marginRight: 8 }}
        size={32}
      />
      <T id="BorrowersPage.borrowers" />
    </h1>

    <BorrowersTable {...props} />
  </section>
);

export default BorrowersPage;
