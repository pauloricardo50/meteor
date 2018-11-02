import * as styles from './utils/styleHelpers';
import { LoanBankPageStyles } from './LoanBankPage';
import { LoanBankBorrowersStyles } from './LoanBankBorrowers';
import { LoanBankProjectStyles } from './LoanBankProject';
import { LoanBankOfferStyles } from './LoanBankOffer';
import { LoanBankCoverStyles } from './LoanBankCover';

const stylesheet = `
    html {
        font-size: 10px;
        font-family: Helvetica;
    }

    .loan-bank-pdf {
        ${styles.flex([
    'FLEX_COLUMN',
    'ALIGN_ITEMS_CENTER',
    'JUSTIFY_CONTENT_FLEX_START',
  ])}
    }

    @page { 
        size: A4;
        margin: 2cm 1.5cm;
    }
    
    ${LoanBankPageStyles}
    ${LoanBankBorrowersStyles}
    ${LoanBankProjectStyles}
    ${LoanBankOfferStyles}
    ${LoanBankCoverStyles}
`;

export default stylesheet;
