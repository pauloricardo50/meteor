import React from 'react';
import { Tabs, Tab } from 'material-ui';


import BorrowersTable from './BorrowersTable';

const BorrowersPage = props => (
    <section className="mask1">
      <h1>Borrowers</h1>
  
      <BorrowersTable {...props}/>
    </section>
  );

export default BorrowersPage