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

    .loan-bank-pdf-header-address {
        ${styles.flex(['FLEX_COLUMN'])}
    }

    .loan-bank-pdf-title {
        ${styles.flex([
    'FLEX_COLUMN',
    'ALIGN_CENTER',
    'JUSTIFY_CONTENT_CENTER',
  ])}
        width: 100%;
        text-transform: uppercase;
        text-align: center;
    }

    .loan-bank-pdf-title h1 {
        margin: 4px 0px;
    }

    .loan-bank-pdf-title h2 {
        color: #888;
    }

    .loan-bank-pdf-info {
        ${styles.flex(['FLEX_COLUMN', 'JUSTIFY_CONTENT_FLEX_END'])}
        width: 100%;
        text-transform: uppercase;
    }

    .loan-bank-pdf-info h3 {
        text-align: right;
        margin: 4px 0px;
    }

    .loan-bank-pdf-page-content {
        ${styles.flex(['FLEX_COLUMN', 'JUSTIFY_CONTENT_FLEX_START'])}
        ${styles.flexGrow(1)}
    }

    .loan-bank-pdf-footer {
    ${styles.flex([
    'FLEX_ROW',
    'ALIGN_ITEMS_CENTER',
    'JUSTIFY_CONTENT_SPACE_BETWEEN',
  ])}
    ${styles.ALIGN_SELF_FLEX_END}
    width: 100%;
    }
`;

export default stylesheet;
