import * as styles from '../utils/styleHelpers';
import recapStyleSheet from './recapStyleSheet';

const stylesheet = `
 .loan-bank-pdf-borrowers {
        ${styles.flex(['FLEX_COLUMN', 'JUSTIFY_CONTENT_FLEX_START'])}
        width: 100%;
    }
.loan-bank-pdf-borrowers-recap {
        ${styles.flex(['FLEX_ROW', 'JUSTIFY_CONTENT_SPACE_BETWEEN'])}
        width: 100%;
    }
.loan-bank-pdf-borrowers-recap-single {
        width: 50%;
    }

.borrowers-recap {
    width: 100%;
    font-size: 10px;
}    

${recapStyleSheet}
`;

export default stylesheet;
