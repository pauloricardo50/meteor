import React from 'react';
import { Tabs, Tab } from 'material-ui';


import AllBorrowersTable from './AllBorrowersTable';

const BorrowersPage = props => (
    <section className="mask1">
      <h1>Borrowers</h1>
  
      <AllBorrowersTable {...props}/>
    </section>
  );

export default BorrowersPage