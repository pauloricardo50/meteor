import { generateLoanBankPDF } from '../methodDefinitions';
import PDFGeneratorService from '../PDFGeneratorService';

generateLoanBankPDF.setHandler((context, { loanId }) =>
  PDFGeneratorService.generateLoanBankPDF(loanId));
