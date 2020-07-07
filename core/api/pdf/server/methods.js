import SecurityService from '../../security';
import {
  generatePDF,
  getSimpleFinancingCertificate,
} from '../methodDefinitions';
import { PDF_TYPES } from '../pdfConstants';
import PDFService from './PDFService';
import ReactPdfService from './ReactPdfService';

generatePDF.setHandler((context, params) => {
  context.unblock();
  SecurityService.checkCurrentUserIsAdmin();
  return PDFService.makePDF(params);
});

getSimpleFinancingCertificate.setHandler((context, params) => {
  SecurityService.loans.isAllowedToUpdate(params.loanId);
  return ReactPdfService.generatePdf(
    PDF_TYPES.SIMPLE_FINANCING_CERTIFICATE,
    params,
  );
});
