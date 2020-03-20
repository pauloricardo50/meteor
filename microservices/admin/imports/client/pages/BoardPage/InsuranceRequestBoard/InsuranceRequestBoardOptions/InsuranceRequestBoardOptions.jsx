import React from 'react';
import { injectIntl } from 'react-intl';
import { useWindowScroll } from 'react-use';
import cx from 'classnames';

import InsuranceRequestBoardOptionsContent from './InsuranceRequestBoardOptionsContent';

const InsuranceRequestBoardOptions = props => {
  const { y } = useWindowScroll();
  return (
    <div className={cx('loan-board-options', { fixed: y > 68 })}>
      <InsuranceRequestBoardOptionsContent {...props} />
    </div>
  );
};

export default injectIntl(InsuranceRequestBoardOptions);
