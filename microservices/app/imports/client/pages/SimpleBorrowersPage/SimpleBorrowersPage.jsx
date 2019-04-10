// @flow
import React from 'react';
import { Element } from 'react-scroll';

import withSimpleAppPage from '../../components/SimpleAppPage/SimpleAppPage';
import SimpleBorrowerPageForms from './SimpleBorrowerPageForms';
import SimpleBorrowersPageMaxPropertyValue from './SimpleBorrowersPageMaxPropertyValue';
import SimpleBorrowersPageHeader from './SimpleBorrowersPageHeader';
import MaxPropertyValueCTA from './MaxPropertyValueCTA';

type SimpleBorrowersPageProps = {};

const SimpleBorrowersPage = ({ loan }: SimpleBorrowersPageProps) => (
  <div className="simple-borrowers-page animated fadeIn">
    <div className="simple-borrowers-page-container">
      <div className="card1 card-top simple-borrowers-page-forms">
        <SimpleBorrowersPageHeader loan={loan} />

        <SimpleBorrowerPageForms loan={loan} />
      </div>
      <MaxPropertyValueCTA loan={loan} />
    </div>
    <Element name="maxPropertyValue" className="maxPropertyValue">
      <SimpleBorrowersPageMaxPropertyValue loan={loan} />
    </Element>
  </div>
);

export default withSimpleAppPage(SimpleBorrowersPage);
