import React from 'react';
import { Tabs, Tab } from 'material-ui';
import { T } from 'core/components/Translation/';

import BorrowersTable from './BorrowersTable';

const BorrowersPage = props => (
    <section className="mask1">
        <h1>
            <T id={`BorrowersPage.borrowers`} />
        </h1>

        <BorrowersTable {...props} />
    </section>
);

export default BorrowersPage;
