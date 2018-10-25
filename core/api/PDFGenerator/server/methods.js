import { SecurityService } from '../..';
import { generateLoanBankPDF } from '../methodDefinitions';
import PDFGeneratorService from '../PDFGeneratorService';

generateLoanBankPDF.setHandler((context, { loanId }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return PDFGeneratorService.generateLoanBankPDF(loanId);
});
