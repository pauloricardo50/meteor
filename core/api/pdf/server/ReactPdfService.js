import React from 'react';
import ReactPDF from '@react-pdf/renderer';

import { ServerIntlProvider } from '../../../utils/server/intl';
import LoanService from '../../loans/server/LoanService';
import { PDF_TYPES } from '../pdfConstants';
import pdfComponents from '../react-pdf/pdfComponents';
import PDFService from './PDFService';

class ReactPdfService {
  getDataForPdfType(pdfType, params) {
    if (pdfType === PDF_TYPES.SIMPLE_FINANCING_CERTIFICATE) {
      const loan = LoanService.get(params.loanId, {
        borrowers: { name: 1 },
        maxPropertyValue: 1,
        name: 1,
        residenceType: 1,
        purchaseType: 1,
      });
      return { loan };
    }

    throw new Error(`Invalid pdf type ${pdfType}`);
  }

  generatePdf(pdfType, params) {
    const data = this.getDataForPdfType(pdfType, params);
    const Pdf = pdfComponents[pdfType];
    const tempFile = `/tmp/${JSON.stringify(params)}.pdf`;

    // This could be done with a stream, but it's too hard to get it to work...
    return ReactPDF.renderToFile(
      <ServerIntlProvider>
        <Pdf {...data} />
      </ServerIntlProvider>,
      tempFile,
    ).then(() => PDFService.getBase64String(tempFile));
  }
}

export default new ReactPdfService();
