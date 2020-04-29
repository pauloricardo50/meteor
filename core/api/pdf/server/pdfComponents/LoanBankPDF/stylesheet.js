import { MARGIN_BOTTOM, MARGIN_SIDE, MARGIN_TOP } from '../../../pdfConstants';
import BorrowersPageStyles from '../pages/BorrowersPdfPage/styles';
import LenderRulesPageStyles from '../pages/LenderRulesPdfPage/stylesheet';
import PropertyPageStyles from '../pages/PropertyPdfPage/stylesheet';
import StructurePageStyles from '../pages/StructurePdfPage/stylesheet';
import PdfPageStyles from '../PdfPage/PdfPageStyles';
import PDFTableStyles from '../PdfTable/PdfTableStyles';
import { LoanBankCoverStyles } from './LoanBankCover';

const stylesheet = `
    @font-face {
        font-family: 'Manrope-variable';
        font-style: normal;
        font-weight: normal;
        src: url('https://www.e-potek.ch/fonts/Manrope-variable.ttf') format('truetype');
        font-weight: 1 999;
    }

    html {
        font-size: 10px;
        font-family: 'Manrope-variable', 'Helvetica', sans-serif;
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
    ${BorrowersPageStyles}
    ${LoanBankCoverStyles}
    ${PdfPageStyles}
    ${PropertyPageStyles}
    ${StructurePageStyles}
    ${LenderRulesPageStyles}
`;

export default stylesheet;
