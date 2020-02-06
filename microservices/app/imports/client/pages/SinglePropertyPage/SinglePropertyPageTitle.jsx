import React from 'react';

import T from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';
import Calculator from 'core/utils/Calculator';
import { SUCCESS } from 'core/api/constants';

const SinglePropertyPageTitle = ({ property, loan }) => {
  const title = property.address1 || <T id="SinglePropertyPage.title" />;
  const progress = Calculator.propertyPercent({ property, loan });
  return (
    <span className="borrowers-page-title">
      {title}
      <small>
        &nbsp; - &nbsp;
        <PercentWithStatus
          value={progress}
          status={progress >= 1 && SUCCESS}
          rounded
        />
      </small>
    </span>
  );
};

export default SinglePropertyPageTitle;
