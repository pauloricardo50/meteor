import React from 'react';
import cx from 'classnames';

import PdfPageTitle from './PdfPageTitle';
import PdfPageHeader from './PdfPageHeader';
import PdfPageFooter from './PdfPageFooter';
import { LastPageContext } from '../Pdf/Pdf';

const PdfPage = ({
  className,
  title,
  fullHeight,
  subtitle,
  children,
  withHeader,
  withFooter,
  pageNb,
  pageCount,
}) => (
  <LastPageContext.Consumer>
    {isLast => (
      <>
        {withHeader && <PdfPageHeader />}
        {withFooter && <PdfPageFooter pageNb={pageNb} pageCount={pageCount} />}
        <div className={cx('page', className, { 'full-height': fullHeight })}>
          <PdfPageTitle title={title} subtitle={subtitle} />
          {children}
        </div>
        {!isLast && <hr className="page-break-new" />}
      </>
    )}
  </LastPageContext.Consumer>
);

export default PdfPage;
