// @flow
import React from 'react';

type PdfPageTitleProps = {};

const PdfPageTitle = ({ title, subtitle }: PdfPageTitleProps) => {
  if (!title && !subtitle) {
    return null;
  }

  return (
    <div className="pdf-page-title">
      <img src="https://www.e-potek.ch/img/logo_square_black.svg" />
      <h1>{title}</h1>
      {subtitle && <h2 className="secondary">{subtitle}</h2>}
    </div>
  );
};

export default PdfPageTitle;
