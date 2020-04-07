import React from 'react';
import cx from 'classnames';
import { injectIntl } from 'react-intl';
import useWindowScroll from 'react-use/lib/useWindowScroll';
import LoanBoardOptionsContent from './LoanBoardOptionsContent';

const LoanBoardOptions = props => {
  const { y } = useWindowScroll();
  return (
    <div className={cx('loan-board-options', { fixed: y > 68 })}>
      <LoanBoardOptionsContent {...props} />
    </div>
  );
};

export default injectIntl(LoanBoardOptions);
