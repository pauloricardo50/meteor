import * as styles from '../utils/styleHelpers';

const stylesheet = `
    .loan-bank-pdf-financing {
        ${styles.flex(['FLEX_COLUMN', 'JUSTIFY_CONTENT_CENTER'])}
        width: 100%;
    }

   .loan-bank-pdf-financing-recap {
        ${styles.flex(['FLEX_ROW', 'JUSTIFY_CONTENT_SPACE_BETWEEN'])}
        width: 100%;
    }

    .loan-bank-pdf-financing-single-structure {
        ${styles.flex(['FLEX_COLUMN'])}
        padding: 16px;
    }

    .loan-bank-pdf-financing-single-structure-cost {
        ${styles.flex(['FLEX_COLUMN', 'ALIGN_ITEMS_CENTER'])}
        outline: 1px solid black;
        margin: 4px;
    }

    .loan-bank-pdf-financing-single-structure-cost-table {
        font-size: 10px;
    }

    .loan-bank-pdf-financing-single-structure-loan {
        ${styles.flex(['FLEX_COLUMN', 'ALIGN_ITEMS_CENTER'])}
        outline: 1px solid black;
        margin: 4px;
    }

    .loan-bank-pdf-financing-single-structure-loan-table {
        font-size: 10px;
    }

    .loan-bank-pdf-financing-single-structure-own-funds {
        ${styles.flex(['FLEX_COLUMN'])}
        outline: 1px solid black;
        margin: 4px;
    }


    .loan-bank-pdf-financing-single-structure-own-funds-table {
        font-size: 10px;
    }

`;

export default stylesheet;
