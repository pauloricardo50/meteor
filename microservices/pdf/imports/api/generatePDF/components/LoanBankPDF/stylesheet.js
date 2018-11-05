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

    @page { 
        size: A4;
        margin: 2cm 1.5cm;

        @top {
          content: flow(header);
        }

        @bottom {
          content: flow(footer);
        }
    }

    .pdf-header {
        flow: static(header);
    }

    .pdf-footer {
        flow: static(footer);
    }

    .page-break-new {
        border: none;
        margin: 0;
        padding: 0;
        page-break-before: always;
    }
    
    ${LoanBankPageStyles}
    ${LoanBankBorrowersStyles}
    ${LoanBankProjectStyles}
    ${LoanBankOfferStyles}
    ${LoanBankCoverStyles}
`;

export default stylesheet;
