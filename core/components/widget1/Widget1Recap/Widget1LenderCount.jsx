import React from 'react';
import PropTypes from 'prop-types';

import { ERROR, SUCCESS, WARNING } from '../../../api/constants';
import T from '../../Translation';

const getLenderCount = (borrowStatus, incomeStatus) => {
  if (borrowStatus !== ERROR && incomeStatus === SUCCESS) {
    return 15;
  }
  if (incomeStatus === WARNING) {
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
    <>
      <hr className="widget1-lender-count-divider" />
      <div className="widget1-lender-count">
        <T id="Widget1LenderCount.label" />
        <span>{count}</span>
      </div>
    </>
  );
};

Widget1LenderCount.propTypes = {
  borrowRule: PropTypes.object.isRequired,
  incomeRule: PropTypes.object.isRequired,
};

export default Widget1LenderCount;
