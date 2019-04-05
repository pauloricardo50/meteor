// @flow
import React from 'react';

import SimpleBorrowerPageForms from './SimpleBorrowerPageForms';
import SimpleBorrowersPageMaxPropertyValue from './SimpleBorrowersPageMaxPropertyValue';
import SimpleBorrowersPageHeader from './SimpleBorrowersPageHeader';

type SimpleBorrowersPageProps = {};

const SimpleBorrowersPage = ({ loan }: SimpleBorrowersPageProps) => (
  <div className="simple-borrowers-page animated fadeIn">
    <div className="card1 card-top simple-borrowers-page-forms">
      <SimpleBorrowersPageHeader loan={loan} />

      <SimpleBorrowerPageForms loan={loan} />
    </div>
    <SimpleBorrowersPageMaxPropertyValue />
  </div>
);

export default SimpleBorrowersPage;
