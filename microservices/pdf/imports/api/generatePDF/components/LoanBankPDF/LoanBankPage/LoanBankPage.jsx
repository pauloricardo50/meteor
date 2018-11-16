// @flow
import React from 'react';
import cx from 'classnames';

import LoanBankHeader from './LoanBankHeader';
import LoanBankTitle from './LoanBankTitle';

type LoanBankPageProps = {
  loan: Object,
  title: String,
};

const LoanBankPage = ({
  title,
  subtitle,
  children,
  isLast,
  fullHeight,
  className,
}: LoanBankPageProps) => (
  <>
    <LoanBankHeader />
    <div className={cx('page', className, { 'full-height': fullHeight })}>
      <LoanBankTitle title={title} subtitle={subtitle} />
      {children}
    </div>
    {!isLast && <hr className="page-break-new" />}
  </>
);

export default LoanBankPage;
