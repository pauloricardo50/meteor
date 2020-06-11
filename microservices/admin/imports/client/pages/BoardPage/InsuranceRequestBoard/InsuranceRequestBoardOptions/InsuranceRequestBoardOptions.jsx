import React from 'react';
import cx from 'classnames';
import useWindowScroll from 'react-use/lib/useWindowScroll';

import InsuranceRequestBoardOptionsContent from './InsuranceRequestBoardOptionsContent';

const InsuranceRequestBoardOptions = props => {
  const { y } = useWindowScroll();
  return (
    <div className={cx('loan-board-options', { fixed: y > 68 })}>
      <InsuranceRequestBoardOptionsContent {...props} />
    </div>
  );
};

export default InsuranceRequestBoardOptions;
