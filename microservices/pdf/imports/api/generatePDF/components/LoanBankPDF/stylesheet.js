import * as styles from './utils/styleHelpers';
import { LoanBankPageStyles } from './LoanBankPage';
import { LoanBankBorrowersStyles } from './LoanBankBorrowers';
import { LoanBankProjectStyles } from './LoanBankProject';
import { LoanBankFinancingStyles } from './LoanBankFinancing';

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
    .loan-bank-pdf-section-title {
        ${styles.flexGrow(1)}
        text-transform: uppercase;
        background-color: #fafafa;
        padding: 8px;
        padding-left: 4px;
    }

    ${LoanBankPageStyles}
    ${LoanBankBorrowersStyles}
    ${LoanBankProjectStyles}
    ${LoanBankFinancingStyles}
`;

export default stylesheet;
