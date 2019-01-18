import SecurityService from '../../security';
import { generatePDF } from '../methodDefinitions';
import PDFService from './PDFService';

generatePDF.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return PDFService.makePDF(params);
});
