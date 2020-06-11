import React from 'react';

import { SUCCESS } from 'core/api/constants';
import PercentWithStatus from 'core/components/PercentWithStatus';
import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';

const RefinancingPageTitle = ({ loan }) => {
  const value = Calculator.refinancingPercent({ loan });

  return (
    <span className="refinancing-page-title">
      <T id="RefinancingPage.title" />
      <small>
        &nbsp; - &nbsp;
        <PercentWithStatus
          value={value}
          status={value >= 1 && SUCCESS}
          rounded
        />
      </small>
    </span>
  );
};

export default RefinancingPageTitle;
