import { MARGIN_TOP, MARGIN_SIDE, MARGIN_BOTTOM } from '../../../pdfConstants';
import BorrowersPageStyles from '../pages/BorrowersPdfPage/styles';
import PDFTableStyles from '../PdfTable/PdfTableStyles';
import PdfPageStyles from '../PdfPage/PdfPageStyles';
import PropertyPageStyles from '../pages/PropertyPdfPage/stylesheet';
import StructurePageStyles from '../pages/StructurePdfPage/stylesheet';
import LenderRulesPageStyles from '../pages/LenderRulesPdfPage/stylesheet';
import { LoanBankCoverStyles } from './LoanBankCover';

const stylesheet = `
    @font-face {
        font-family: 'Eina04';
        font-style: normal;
        font-weight: normal;
        src: url('https://www.e-potek.ch/fonts/Eina04_Regular.eot');
        src: url('https://www.e-potek.ch/fonts/Eina04_Regular.eot') format('embedded-opentype');
        src: url('https://www.e-potek.ch/fonts/Eina04_Regular.ttf') format('truetype');
        src: url('https://www.e-potek.ch/fonts/Eina04_Regular.woff') format('woff');
    }

    @font-face {
        font-family: 'Eina04';
        font-style: normal;
        font-weight: bold;
        src: url('https://www.e-potek.ch/fonts/Eina04_Bold.eot');
        src: url('https://www.e-potek.ch/fonts/Eina04_Bold.eot') format('embedded-opentype');
        src: url('https://www.e-potek.ch/fonts/Eina04_Bold.ttf') format('truetype');
        src: url('https://www.e-potek.ch/fonts/Eina04_Bold.woff') format('woff');
    }


    html {
        font-size: 10px;
        font-family: 'Eina04', sans-serif;
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
    ${BorrowersPageStyles}
    ${LoanBankCoverStyles}
    ${PdfPageStyles}
    ${PropertyPageStyles}
    ${StructurePageStyles}
    ${LenderRulesPageStyles}
`;

export default stylesheet;
