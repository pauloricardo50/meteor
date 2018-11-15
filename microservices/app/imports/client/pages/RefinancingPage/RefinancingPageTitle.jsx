// @flow
import React from 'react';

import T from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';
import Calculator from 'core/utils/Calculator';
import { SUCCESS } from 'core/api/constants';

type RefinancingPageTitleProps = {};

const RefinancingPageTitle = ({ loan }: RefinancingPageTitleProps) => {
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
