import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import T from 'core/components/Translation';
import { createRoute } from 'core/utils/routerUtils';

import ADMIN_ROUTES from '../../../startup/client/adminRoutes';
import LoanAdder from './LoanAdder';
import LoanSummary from './LoanSummary';

const LoanSummaryList = ({ loans, userId, withAdder }) => {
  const history = useHistory();
  if (loans && loans.length > 0) {
    return (
      <div className="mt-40">
        <h3 className="mt-0">
          <T id="collections.loans" />
          {withAdder && (
            <LoanAdder
              userId={userId}
              onSuccess={loanId =>
                history.push(
                  createRoute(ADMIN_ROUTES.SINGLE_LOAN_PAGE.path, { loanId }),
                )
              }
            />
          )}
        </h3>
        {loans.map(loan => (
          <LoanSummary loan={loan} key={loan._id} />
        ))}
      </div>
    );
  }

  return (
    <h3 className="mt-40">
      <T id="LoanSummaryList.noLoans" />
      {withAdder && (
        <LoanAdder
          userId={userId}
          onSuccess={loanId =>
            history.push(
              createRoute(ADMIN_ROUTES.SINGLE_LOAN_PAGE.path, { loanId }),
            )
          }
        />
      )}
    </h3>
  );
};

LoanSummaryList.propTypes = {
  loans: PropTypes.array.isRequired,
  userId: PropTypes.string.isRequired,
};

export default LoanSummaryList;
