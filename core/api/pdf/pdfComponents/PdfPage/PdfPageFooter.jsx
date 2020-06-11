import React from 'react';

const PdfPageFooter = ({ pageNb, pageCount }) => (
  <div className="pdf-page-footer">
    <div>
      <span className="bold">e-Potek SA</span>
      &nbsp;
      <span>Place de Neuve 2, 1204 Genève &bull; +41 22 566 01 10</span>
    </div>
    <div>
      Page {pageNb}/{pageCount}
    </div>
  </div>
);

export default PdfPageFooter;
