import * as styles from '../utils/styleHelpers';

const stylesheet = `
    .loan-bank-pdf-page {
        ${styles.flex(['FLEX_COLUMN', 'JUSTIFY_CONTENT_FLEX_START'])}
        height: 722px;
        width: 100%;
    }

    .loan-bank-pdf-header {
        ${styles.flex([
    'FLEX_ROW',
    'ALIGN_ITEMS_CENTER',
    'JUSTIFY_CONTENT_SPACE_BETWEEN',
  ])}
        width: 100%;
    }

    .loan-bank-pdf-info {
        ${styles.flex([
    'FLEX_ROW',
    'ALIGN_ITEMS_CENTER',
    'JUSTIFY_CONTENT_FLEX_END',
  ])}
        width: 100%;
        text-transform: uppercase;
    }

    .loan-bank-pdf-page-content {
        ${styles.flex(['FLEX_COLUMN', 'JUSTIFY_CONTENT_FLEX_START'])}
        ${styles.flexGrow(1)}
    }

    .loan-bank-pdf-footer {
    ${styles.flex(['FLEX_ROW', 'ALIGN_ITEMS_CENTER', 'JUSTIFY_CONTENT_CENTER'])}
    ${styles.ALIGN_SELF_FLEX_END}
    }
`;

export default stylesheet;
