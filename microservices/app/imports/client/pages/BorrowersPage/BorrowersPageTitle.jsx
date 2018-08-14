// @flow
import React from 'react';

import T from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';
import BorrowerCalculator from 'core/utils/Calculator/BorrowerCalculator';
import { SUCCESS } from 'core/api/constants';

type BorrowersPageTitleProps = {};

const BorrowersPageTitle = ({ borrowers }: BorrowersPageTitleProps) => {
  const value = BorrowerCalculator.personalInfoPercent({
    borrowers,
  });
  return (
    <span className="borrowers-page-title">
      <T id="BorrowersPage.title" />
      <small>
        &nbsp; - &nbsp;
        <PercentWithStatus value={value} status={value >= 1 && SUCCESS} />
      </small>
    </span>
  );
};

export default BorrowersPageTitle;
