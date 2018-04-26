import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import { WARNING, ERROR, SUCCESS } from 'core/api/constants';

const getLenderCount = (borrowStatus, incomeStatus) => {
  if (borrowStatus !== ERROR && incomeStatus === SUCCESS) {
    return 15;
  } else if (incomeStatus === WARNING) {
    return 4;
  }
  return '-';
};

const Widget1LenderCount = ({
  borrowRule: { status: borrowStatus },
  incomeRule: { status: incomeStatus },
}) => {
  const count = getLenderCount(borrowStatus, incomeStatus);

  return (
    <React.Fragment>
      <hr className="widget1-lender-count-divider" />
      <div className="widget1-lender-count">
        <T id="Widget1LenderCount.label" />
        <span>{count}</span>
      </div>
    </React.Fragment>
  );
};

Widget1LenderCount.propTypes = {
  borrowRule: PropTypes.object.isRequired,
  incomeRule: PropTypes.object.isRequired,
};

export default Widget1LenderCount;
