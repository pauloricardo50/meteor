import React, { Component, PropTypes } from 'react';

import BorrowerOverview from './informationPage/BorrowerOverview.jsx';
import PropertyOverview from './informationPage/PropertyOverview.jsx';

const InformationPage = props => (
  <section>
    <h1>Mes Informations</h1>
    <BorrowerOverview borrowers={props.borrowers} />

    {props.loanRequests.length > 0 && <hr />}
    {props.loanRequests.length > 0 &&
      <PropertyOverview loanRequests={props.loanRequests} />}

  </section>
);

InformationPage.propTypes = {
  borrowers: PropTypes.arrayOf(PropTypes.any),
  loanRequests: PropTypes.arrayOf(PropTypes.any),
};

InformationPage.defaultProps = {
  borrowers: [],
  loanRequests: [],
};

export default InformationPage;
