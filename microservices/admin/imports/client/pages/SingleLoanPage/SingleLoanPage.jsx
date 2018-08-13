import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import { IntlNumber } from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';
import { TASK_STATUS } from 'core/api/tasks/taskConstants';
import LoanTabs from './LoanTabs';

import SingleLoanPageContainer from './SingleLoanPageContainer';
import LoanTasksTable from './LoanTabs/LoanTasksTable';

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
      <h1>
        {loan.name || 'Demande de Prêt'} - Emprunt de{' '}
        <IntlNumber
          value={Calculator.getEffectiveLoan({ loan })}
          format="money"
        />
      </h1>
      <div className="card1 card-top single-loan-page-tasks">
        <h3>Tâches</h3>
        <LoanTasksTable
          showAssignee
          loanId={loan._id}
          propertyId={dataToPassDown.property && dataToPassDown.property._id}
          borrowerIds={loan.borrowerIds}
          hideIfNoData
          tableFilters={{
            filters: {
              status: [TASK_STATUS.ACTIVE],
            },
            options: {
              status: Object.values(TASK_STATUS),
            },
          }}
        />
      </div>
      <LoanTabs {...dataToPassDown} />
    </section>
  );
};

SingleLoanPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default compose(SingleLoanPageContainer)(SingleLoanPage);
