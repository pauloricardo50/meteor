import { CONTENT_HEIGHT } from '../../../pdfConstants';
import * as styles from '../utils/styleHelpers';
import { BORDER_BLUE } from '../cssConstants';

const PdfPageStyles = `
    .page {
        ${styles.flex(['FLEX_COLUMN', 'JUSTIFY_CONTENT_FLEX_START'])}
        width: 100%;
        box-sizing: border-box;
    }

    .full-height {
        height: ${CONTENT_HEIGHT}mm;
    }

    .header {
        ${styles.flex([
    'FLEX_ROW',
    'ALIGN_ITEMS_CENTER',
    'JUSTIFY_CONTENT_SPACE_BETWEEN',
  ])}
        width: 100%;
        height: 120px;
        margin-top: 24px;
    }

    .address {
        ${styles.flex(['FLEX_COLUMN'])}
    }

    .address .company-name {
        font-weight: bold;
    }

    .pdf-page-title {
        margin-bottom: 16px;
    }

    .pdf-page-title h1 {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin: 0;
        color: ${BORDER_BLUE};
        font-weight: normal;
    }

    .pdf-page-title img {
        width: 30px;
        height: 30px;
        margin-right: 12px;
    }

    .pdf-page-footer {
        display: flex;
        justify-content: space-between;
        border-top: 1px solid ${BORDER_BLUE};
        width: 100%;
        height: 100%;
        padding-top: 16px;
        color: ${BORDER_BLUE};
        font-size: 10px;
    }

    .bold {
        font-weight: bold;
    }
`;

export default PdfPageStyles;
