import React from 'react';

import T from 'core/components/Translation';

import DashboardRecapFinance from './DashboardRecapFinance';
import DashboardRecapProperty from './DashboardRecapProperty';
import DashboardRecapPromotion from './DashboardRecapPromotion';

const DashboardRecap = (props) => {
  const propertyToDisplay = props.loan.structure.property || props.loan.properties[0];
  const {
    loan: { hasPromotion },
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
          <DashboardRecapPromotion {...props} />
        ) : (
          <DashboardRecapProperty
            property={propertyToDisplay}
            loanId={props.loan._id}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardRecap;
