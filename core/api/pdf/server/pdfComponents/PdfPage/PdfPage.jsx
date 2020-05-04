import React from 'react';
import cx from 'classnames';

import { LastPageContext } from '../Pdf/Pdf';
import PdfPageFooter from './PdfPageFooter';
import PdfPageHeader from './PdfPageHeader';
import PdfPageTitle from './PdfPageTitle';

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
