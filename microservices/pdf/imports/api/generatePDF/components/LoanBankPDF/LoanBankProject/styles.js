import * as styles from '../utils/styleHelpers';

const stylesheet = `
    .loan-bank-pdf-project {
        ${styles.flex(['FLEX_COLUMN', 'JUSTIFY_CONTENT_CENTER'])}
        width: 100%;
    }
    .loan-bank-pdf-project-recap {
        ${styles.flex(['FLEX_ROW', 'JUSTIFY_CONTENT_SPACE_AROUND'])}
        ${styles.flexGrow(1)}
    }
    .loan-bank-pdf-property {
        ${styles.flex(['FLEX_COLUMN', 'JUSTIFY_CONTENT_FLEX_START'])}
        ${styles.flexGrow(1)}
        ${styles.flexBasis('50%')}
        ${styles.flexShrink(0)}
    }
    .loan-bank-pdf-property-table {
        font-size: 10px;
    }
    .loan-bank-pdf-project-details {
        ${styles.flex(['FLEX_COLUMN', 'JUSTIFY_CONTENT_FLEX_START'])}
        ${styles.flexGrow(1)}
        ${styles.flexBasis('50%')}
        ${styles.flexShrink(0)}
    }
    .loan-bank-pdf-project-table {
        font-size: 10px;
    }
`;

export default stylesheet;
