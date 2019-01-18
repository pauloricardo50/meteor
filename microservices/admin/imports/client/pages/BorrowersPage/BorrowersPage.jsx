import React from 'react';
import T from 'core/components/Translation/';

import Icon from 'core/components/Icon/Icon';
import collectionIcons from 'core/arrays/collectionIcons';
import { BORROWERS_COLLECTION } from 'core/api/constants';
import BorrowersTable from './BorrowersTable';

const BorrowersPage = props => (
  <section className="card1 card-top borrowers-page">
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
