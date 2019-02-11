import SecurityService from '../../security';
import { generatePDF } from '../methodDefinitions';
import PDFService from './PDFService';

generatePDF.setHandler((context, params) => {
  context.unblock();
  SecurityService.checkCurrentUserIsAdmin();
  return PDFService.makePDF(params);
});
