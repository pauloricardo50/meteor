import LoanBoardOptionsContent from './LoanBoardOptionsContent';
import React from 'react';
import cx from 'classnames';
import { injectIntl } from 'react-intl';
import useWindowScroll from 'react-use/lib/useWindowScroll';

const LoanBoardOptions = props => {
  const { y } = useWindowScroll();
  return (
    <div className={cx('loan-board-options', { fixed: y > 68 })}>
      <LoanBoardOptionsContent {...props} />
    </div>
  );
};

export default injectIntl(LoanBoardOptions);
