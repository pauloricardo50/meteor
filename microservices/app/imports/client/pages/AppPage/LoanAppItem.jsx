import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';
import { LOAN_STATUS } from 'core/api/constants';
import AppItem from './AppItem';

const LoanAppItem = ({ loan }) => (
  <AppItem
    key={loan._id}
    title={loan.name || <T id="AppPage.noName" />}
    subtitle={
      loan.status === LOAN_STATUS.ACTIVE ? (
        <T id="AppPage.loan" />
      ) : (
        <T id="AppPage.loan.done" />
      )
    }
    mainText={
      loan.status === LOAN_STATUS.ACTIVE ? (
        <span>
          <T id="AppPage.step" values={{ step: loan.logic.step }} />
          {!loan.name && (
            <span>
              <br />
              <span className="active">
                <T id="AppPage.begin" />
              </span>
            </span>
          )}
        </span>
      ) : (
        <span className="fa fa-home fa-2x heart-beat active" />
      )
    }
    href={`/loans/${loan._id}`}
  />
);

LoanAppItem.propTypes = {
  loan: PropTypes.object.isRequired,
};

export default LoanAppItem;
