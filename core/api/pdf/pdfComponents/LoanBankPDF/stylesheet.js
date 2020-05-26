import {
  BOLD_WEIGHT,
  MARGIN_BOTTOM,
  MARGIN_SIDE,
  MARGIN_TOP,
  REGULAR_WEIGHT,
} from '../../pdfConstants';
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
        font-variant-numeric: tabular-nums;
        font-weight: ${REGULAR_WEIGHT};
        line-height: 1.4375rem;
        color: #2c2c2c;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        margin: 0.67em 0;

        color: #2c2c2c;

        font-weight: ${BOLD_WEIGHT};
    }

    h1, .font-size-1 {
        font-size: 2.5rem;
        line-height: 3.5rem;
    }

    h2, .font-size-2 {
        font-size: 2rem;
        line-height: 3rem;
    }

    h3, .font-size-3 {
        font-size: 1.75rem;
        line-height: 2.5rem;
    }

    h4, .font-size-4 {
        font-size: 1.5rem;
        line-height: 2.125rem;
        font-weight: ${REGULAR_WEIGHT};
    }

    h5, .font-size-5 {
        font-size: 1.25rem;
        line-height: 1.75rem;
        font-weight: ${REGULAR_WEIGHT};
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
