import React from 'react';

import T from 'core/components/Translation';

import DashboardRecapFinance from './DashboardRecapFinance';
import DashboardRecapProperty from './DashboardRecapProperty';
import DashboardRecapPromotion from './DashboardRecapPromotion';

const DashboardRecap = props => {
  const propertyToDisplay =
    (props.loan.structure && props.loan.structure.property) ||
    (props.loan.properties && props.loan.properties[0]);
  const {
    loan: { hasPromotion, promotions, _id: loanId },
  } = props;

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
