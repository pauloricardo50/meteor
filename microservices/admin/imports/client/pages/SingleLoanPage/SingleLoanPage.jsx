import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import { IntlNumber } from 'core/components/Translation';
import { getLoanValue } from 'core/utils/loanFunctions';
import ServerTimeContainer from 'core/components/ServerTimeContainer';
import LoanTabs from './LoanTabs';
import SingleLoanPageContainer from './SingleLoanPageContainer';
import LoanTasksTable from './LoanTabs/LoanTasksTable';

const SingleLoanPage = ({ loan, serverTime, ...rest }) => {
  const dataToPassDown = {
    ...rest,
    loan,
    property: loan.property,
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
        <h3>Tâches</h3>
        <LoanTasksTable
          showAssignee
          loanId={loan._id}
          propertyId={loan.property._id}
          borrowerIds={loan.borrowerIds}
        />
      </div>
      <LoanTabs
        {...dataToPassDown}
        serverTime={serverTime}
        dataToPassDown={dataToPassDown}
      />
    </section>
  );
};

SingleLoanPage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  serverTime: PropTypes.object.isRequired,
};

export default compose(SingleLoanPageContainer, ServerTimeContainer)(SingleLoanPage);
