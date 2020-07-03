import React from 'react';
import ReactPDF from '@react-pdf/renderer';

import { ServerIntlProvider } from '../../../utils/server/intl';
import LoanService from '../../loans/server/LoanService';
import { PDF_TYPES } from '../pdfConstants';
import SimpleFinancingCertificate from '../react-pdf/FinancingCertificate/SimpleFinancingCertificate';
import PDFService from './PDFService';

class ReactPdfService {
  getPdfForType(pdfType, params) {
    if (pdfType === PDF_TYPES.SIMPLE_FINANCING_CERTIFICATE) {
      const loan = LoanService.get(params.loanId, {
        borrowers: { name: 1 },
        maxPropertyValue: 1,
        name: 1,
        residenceType: 1,
        purchaseType: 1,
      });
      return { Pdf: SimpleFinancingCertificate, data: { loan } };
    }

    throw new Error(`Invalid pdf type ${pdfType}`);
  }

  generatePdf(pdfType, params) {
    const { Pdf, data } = this.getPdfForType(pdfType, params);
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
