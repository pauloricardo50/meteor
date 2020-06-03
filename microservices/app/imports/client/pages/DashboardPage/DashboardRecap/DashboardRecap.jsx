import React from 'react';

import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';

import DashboardRecapFinance from './DashboardRecapFinance';
import DashboardRecapPromotion from './DashboardRecapPromotion';
import DashboardRecapProperty from './DashboardRecapProperty';

const DashboardRecap = props => {
  const { loan } = props;
  const { hasPromotion, promotions, _id: loanId } = loan;
  const propertyToDisplay = Calculator.selectProperty({ loan });

  return (
    <div className="dashboard-recap">
      <h2 className="secondary">
        <small>
          <T id="DashboardRecap.title" />
        </small>
      </h2>

      <div className="cards">
        <DashboardRecapFinance {...props} />
        {hasPromotion ? (
          <DashboardRecapPromotion
            {...props}
            promotion={promotions && promotions.length > 0 && promotions[0]}
          />
        ) : (
          <DashboardRecapProperty
            property={propertyToDisplay}
            loanId={loanId}
            growRecap
          />
        )}
      </div>
    </div>
  );
};

export default DashboardRecap;
