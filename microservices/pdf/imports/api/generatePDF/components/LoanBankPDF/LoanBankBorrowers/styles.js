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
    font-size: 12px;
}

.borrowers-recap .info td {
    text-align: left;
}

.money-amount {
    text-align: right;  
    width: 60%;
    align-self: center;
    white-space: nowrap;
}

${recapStyleSheet}
`;

export default stylesheet;
