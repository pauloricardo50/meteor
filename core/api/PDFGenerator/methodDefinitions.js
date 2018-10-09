import { Method } from '../methods/methods';

export const generateLoanBankPDF = new Method({
  name: 'generateLoanBankPDF',
  params: {
    loanId: String,
  },
});
