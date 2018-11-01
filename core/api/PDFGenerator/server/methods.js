import { SecurityService } from '../..';
import { generatePDF } from '../methodDefinitions';
import PDFGeneratorService from '../PDFGeneratorService';

generatePDF.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return PDFGeneratorService.generatePDF(params);
});
