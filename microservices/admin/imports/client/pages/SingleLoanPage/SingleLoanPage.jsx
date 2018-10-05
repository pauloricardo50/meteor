import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import LoanTabs from './LoanTabs';
import SingleLoanPageContainer from './SingleLoanPageContainer';
import SingleLoanPageHeader from './SingleLoanPageHeader';
import GetLoanPDF from '../../components/GetLoanPDF/GetLoanPDF';
import SingleLoanPageTasks from './SingleLoanPageTasks';

const SingleLoanPage = ({ loan, ...rest }) => {
  const dataToPassDown = {
    ...rest,
    loan,
    property: (loan.structure && loan.structure.property) || loan.properties[0],
    properties: loan.properties,
    borrowers: loan.borrowers,
    offers: loan.offers,
  };

  return (
    <section className="single-loan-page">
      <SingleLoanPageHeader loan={loan} />
      <SingleLoanPageTasks loan={loan} />
      <LoanTabs {...dataToPassDown} />
      <GetLoanPDF loan={loan} />
    </section>
  );
};

SingleLoanPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default compose(SingleLoanPageContainer)(SingleLoanPage);
