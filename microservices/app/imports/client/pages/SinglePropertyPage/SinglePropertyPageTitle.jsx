// @flow
import React from 'react';

import T from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';
import PropertyCalculator from 'core/utils/Calculator/PropertyCalculator';
import { SUCCESS } from 'core/api/constants';

type SinglePropertyPageTitleProps = {};

const SinglePropertyPageTitle = ({
  property,
  loan,
}: SinglePropertyPageTitleProps) => {
  const title = property.address1 || <T id="SinglePropertyPage.title" />;
  const progress = PropertyCalculator.propertyPercent({
    property,
    loan,
  });
  return (
    <span className="borrowers-page-title">
      {title}
      <small>
        &nbsp; - &nbsp;
        <PercentWithStatus value={progress} status={progress >= 1 && SUCCESS} />
      </small>
    </span>
  );
};

export default SinglePropertyPageTitle;
