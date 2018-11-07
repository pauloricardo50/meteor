import * as styles from './utils/styleHelpers';
import { LoanBankPageStyles } from './LoanBankPage';
import { LoanBankBorrowersStyles } from './LoanBankBorrowers';
import { LoanBankProjectStyles } from './LoanBankProject';
import { LoanBankCoverStyles } from './LoanBankCover';
import PDFTableStyles from './utils/PDFTableStyles';

const stylesheet = `
    html {
        font-size: 12px;
        font-family: Helvetica;
    }

    * {
        // border: 1px solid red;
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
    
    ${PDFTableStyles}
    ${LoanBankPageStyles}
    ${LoanBankBorrowersStyles}
    ${LoanBankProjectStyles}
    ${LoanBankCoverStyles}
`;

export default stylesheet;
