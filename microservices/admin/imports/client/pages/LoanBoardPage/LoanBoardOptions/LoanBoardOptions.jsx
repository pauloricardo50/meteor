// @flow
import React from 'react';
import { injectIntl } from 'react-intl';
import { useWindowScroll } from 'react-use';
import cx from 'classnames';

import LoanBoardOptionsContent from './LoanBoardOptionsContent';

type LoanBoardOptionsProps = {};

const LoanBoardOptions = (props: LoanBoardOptionsProps) => {
  const { y } = useWindowScroll();
  console.log('--LoanBoardOptions-----', props)
  return (
    <div className={cx('loan-board-options', { fixed: y > 68 })}>
      <LoanBoardOptionsContent {...props} />
    </div>
  );
};

export default injectIntl(LoanBoardOptions);
