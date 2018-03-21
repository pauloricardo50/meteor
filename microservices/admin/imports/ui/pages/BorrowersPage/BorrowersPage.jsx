import React from 'react';
import { T } from 'core/components/Translation/';

import BorrowersTable from './BorrowersTable';
import BorrowersPageContainer from './BorrowersPageContainer';

const BorrowersPage = props => (
  <section className="mask1">
    <h1>
      <T id="BorrowersPage.borrowers" />
    </h1>

    <BorrowersTable {...props} />
  </section>
);

export default BorrowersPageContainer(BorrowersPage);
