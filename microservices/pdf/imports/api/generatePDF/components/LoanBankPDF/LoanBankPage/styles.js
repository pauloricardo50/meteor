import * as styles from '../utils/styleHelpers';

const stylesheet = `
    .page {
        ${styles.flex(['FLEX_COLUMN', 'JUSTIFY_CONTENT_FLEX_START'])}
        width: 100%;
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

    .page-title {
        ${styles.flex(['FLEX_COLUMN', 'JUSTIFY_CONTENT_FLEX_START'])}
        text-transform: uppercase;
        padding: 4px;
    }

    .page-title h1 {
        margin-top: 0;
    }

    .page-title h2 {
        margin-top: 0;
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

    .page.content {
        ${styles.flex(['FLEX_COLUMN', 'JUSTIFY_CONTENT_FLEX_START'])}
        ${styles.flexGrow(1)}
    }
`;

export default stylesheet;
