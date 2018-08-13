import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import LoanTabs from './LoanTabs';
import SingleLoanPageContainer from './SingleLoanPageContainer';
import LoanTasksTable from './LoanTabs/LoanTasksTable';
import SingleLoanPageHeader from './SingleLoanPageHeader';

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
      <div className="card1 card-top single-loan-page-tasks">
        <LoanTasksTable
          showAssignee
          loanId={loan._id}
          propertyId={dataToPassDown.property && dataToPassDown.property._id}
          borrowerIds={loan.borrowerIds}
          hideIfNoData
        >
          <h3>Tâches</h3>
        </LoanTasksTable>
      </div>
      <LoanTabs {...dataToPassDown} />
    </section>
  );
};

SingleLoanPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default compose(SingleLoanPageContainer)(SingleLoanPage);
