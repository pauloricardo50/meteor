import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import { IntlNumber } from 'core/components/Translation';
import { getLoanValue } from 'core/utils/loanFunctions';
import LoanTabs from './LoanTabs';
import SingleLoanPageContainer from './SingleLoanPageContainer';
import LoanTasksTable from './LoanTabs/LoanTasksTable';

const SingleLoanPage = ({ loan, ...rest }) => {
  const dataToPassDown = {
    ...rest,
    loan,
    property: loan.structure && loan.structure.property,
    properties: loan.properties,
    borrowers: loan.borrowers,
    offers: loan.offers,
  };

  return (
    <section className="single-loan-page">
      <h1>
        {loan.name || 'Demande de Prêt'} - Emprunt de{' '}
        <IntlNumber
          value={getLoanValue({ loan, property: loan.property })}
          format="money"
        />
      </h1>
      <div className="mask1 single-loan-page-tasks">
        <LoanTasksTable
          showAssignee
          loanId={loan._id}
          propertyId={dataToPassDown.property._id}
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
