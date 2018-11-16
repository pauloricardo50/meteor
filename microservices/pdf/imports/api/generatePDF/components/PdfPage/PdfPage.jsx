// @flow
import React from 'react';
import cx from 'classnames';

import PdfPageTitle from './PdfPageTitle';
import PdfPageHeader from './PdfPageHeader';
import PdfPageFooter from './PdfPageFooter';

type PdfPageProps = {};

const PdfPage = ({
  className,
  title,
  fullHeight,
  subtitle,
  isLast,
  children,
  withHeader,
  withFooter,
  pageNb,
  pageCount,
}: PdfPageProps) => (
  <>
    {withHeader && <PdfPageHeader />}
    {withFooter && <PdfPageFooter pageNb={pageNb} pageCount={pageCount} />}
    <div className={cx('page', className, { 'full-height': fullHeight })}>
      <PdfPageTitle title={title} subtitle={subtitle} />
      {children}
    </div>
    {!isLast && <hr className="page-break-new" />}
  </>
);

export default PdfPage;
