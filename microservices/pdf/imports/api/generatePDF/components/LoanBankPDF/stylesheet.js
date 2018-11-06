import * as styles from './utils/styleHelpers';
import { LoanBankPageStyles } from './LoanBankPage';
import { LoanBankBorrowersStyles } from './LoanBankBorrowers';
import { LoanBankProjectStyles } from './LoanBankProject';
import { LoanBankOfferStyles } from './LoanBankOffer';
import { LoanBankCoverStyles } from './LoanBankCover';

const stylesheet = `
    html {
        font-size: 12px;
        font-family: Helvetica;
    }

    * {
        border: 1px solid red;
    }

    @page { 
        size: A4;
        margin: 3cm 1.5cm 2cm 1.5cm;

        @top-left {
            content: flow(top-left);
        }

        @top-right {
            content: flow(top-right);
        }

        @top {
          content: flow(header);
        }

        @bottom {
          content: flow(footer);
        }

        @bottom-right {
           content: counter(page);
        }
    }

    .top-left {
        flow: static(top-left);
    }

    .top-right {
        flow: static(top-right);
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

    .pdf-table tr {
        width: 100%;
    }

    .pdf-table td {
        width: 50%;
    }

    table td {
        padding: 4px 16px;
    }

    tr td:first-of-type {
        opacity: 0.8;
    }
    
    ${LoanBankPageStyles}
    ${LoanBankBorrowersStyles}
    ${LoanBankProjectStyles}
    ${LoanBankOfferStyles}
    ${LoanBankCoverStyles}
`;

export default stylesheet;
