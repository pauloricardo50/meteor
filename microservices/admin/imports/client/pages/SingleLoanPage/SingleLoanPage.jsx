import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import LoanTabs from './LoanTabs';
import SingleLoanPageContainer from './SingleLoanPageContainer';
import SingleLoanPageHeader from './SingleLoanPageHeader';
import SingleLoanPageTasks from './SingleLoanPageTasks';

const SingleLoanPage = ({ loan, Calculator, ...rest }) => {
  const dataToPassDown = {
    ...rest,
    loan,
    property: (loan.structure && loan.structure.property) || loan.properties[0],
    properties: loan.properties,
    borrowers: loan.borrowers,
    offers: loan.offers,
    Calculator,
  };

  return (
    <section className="single-loan-page">
      <Helmet>
        <title>{loan.user ? loan.user.name : loan.name}</title>
      </Helmet>
      <SingleLoanPageHeader loan={loan} />
      <SingleLoanPageTasks loan={loan} />
      <LoanTabs {...dataToPassDown} />
    </section>
  );
};

SingleLoanPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default SingleLoanPageContainer(SingleLoanPage);
