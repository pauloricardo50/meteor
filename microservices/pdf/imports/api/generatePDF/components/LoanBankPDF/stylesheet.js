import { LoanBankBorrowersStyles } from './LoanBankBorrowers';
import { LoanBankProjectStyles } from './LoanBankProject';
import { LoanBankCoverStyles } from './LoanBankCover';
import PDFTableStyles from '../PdfTable/PdfTableStyles';
import { MARGIN_TOP, MARGIN_SIDE, MARGIN_BOTTOM } from '../../constants';
import PdfPageStyles from '../PdfPage/PdfPageStyles';

const stylesheet = `
    html {
        font-size: 12px;
        font-family: Helvetica;
    }

    * {
        // border: 1px solid red;
        // border-radius: 8px;
    }

    @page {
        size: A4;
        margin: ${MARGIN_TOP}mm ${MARGIN_SIDE}mm ${MARGIN_BOTTOM}mm ${MARGIN_SIDE}mm;

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

        // @bottom-right {
        //    content: "Page " counter(page) "/" counter(pages);
        //    font-family: Helvetica;
        // }
    }

    .top-left {
        flow: static(top-left);
    }

    .top-right {
        flow: static(top-right);
    }

    .pdf-page-header {
        flow: static(header);
    }

    .pdf-page-footer {
        flow: static(footer);
    }

    .page-break-new {
        border: none;
        margin: 0;
        padding: 0;
        height: 0;
        page-break-before: always;
    }

    ${PDFTableStyles}
    ${LoanBankBorrowersStyles}
    ${LoanBankProjectStyles}
    ${LoanBankCoverStyles}
    ${PdfPageStyles}
`;

export default stylesheet;
