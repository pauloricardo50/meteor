import * as styles from '../../../utils/styleHelpers';

const stylesheet = `
    .cover-page {
        ${styles.flex(['FLEX_COLUMN', 'ALIGN_ITEMS_CENTER'])}
        ${styles.flexGrow(1)}
        padding: 30px;
    }

    .cover-page .loan-info {
        ${styles.flex(['FLEX_COLUMN', 'ALIGN_ITEMS_CENTER'])}
        ${styles.flexGrow(1)}
        padding: 48px;
    } 

    .loan-info h1 {
        text-transform: uppercase;
    }

    .loan-info h2 {
        margin-bottom: 48px;
        text-transform: uppercase;
    }

    .cover-page .cover-footer {
        ${styles.flex([
    'FLEX_ROW',
    'ALIGN_ITEMS_FLEX_END',
    'JUSTIFY_CONTENT_SPACE_BETWEEN',
  ])}
        ${styles.ALIGN_SELF_FLEX_END}
        width: 100%;
        ${styles.flexGrow(1)}
    }

    .cover-footer .assigned-employee {
        ${styles.flex(['FLEX_COLUMN'])}
    }
`;

export default stylesheet;
