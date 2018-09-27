import * as styles from './utils/styleHelpers';
import { LoanBankPageStyles } from './LoanBankPage';
import { LoanBankBorrowersStyles } from './LoanBankBorrowers';
import { LoanBankProjectStyles } from './LoanBankProject';
import { LoanBankFinancingStyles } from './LoanBankFinancing';
import { LoanBankCoverStyles } from './LoanBankCover';

const stylesheet = `
    html {
        font-size: 10px;
    }
    .loan-bank-pdf {
        width: 500px;
        height: auto;
        ${styles.flex([
    'FLEX_COLUMN',
    'ALIGN_ITEMS_CENTER',
    'JUSTIFY_CONTENT_FLEX_START',
  ])}
    }
    
    ${LoanBankPageStyles}
    ${LoanBankBorrowersStyles}
    ${LoanBankProjectStyles}
    ${LoanBankFinancingStyles}
    ${LoanBankCoverStyles}
`;

export default stylesheet;
