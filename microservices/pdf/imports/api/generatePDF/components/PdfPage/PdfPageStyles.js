import * as styles from '../utils/styleHelpers';
import { CONTENT_HEIGHT } from '../../constants';

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
    }

    .pdf-page-title h1 {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin: 0;
    }

    .pdf-page-title img {
        width: 50px;
        height: 50px;
        margin-right: 16px;
    }
`;

export default PdfPageStyles;
