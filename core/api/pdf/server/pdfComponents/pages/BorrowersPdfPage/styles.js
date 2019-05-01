import { BORDER_BLUE } from '../../../../pdfConstants';
import recapStyleSheet from './recapStyleSheet';

const stylesheet = `
    .borrowers-recap {
        width: 100%;
    }

    .borrowers-recap:not(:first-child) {
        margin-top: 30px;
    }

    .borrowers-recap.twoBorrowers {
        width: 100%;
    }

    .borrowers-recap.twoBorrowers td {
        width: 25%;
    }

    .borrowers-recap.twoBorrowers.info {
        width: 75%;
    }

    .borrowers-recap .info td {
        text-align: left;
    }

    .money-amount {
        text-align: right;
        white-space: nowrap;
    }

    .borrowers-page h2 {
        color: ${BORDER_BLUE}
    }

    .borrowers-recap.twoBorrowers tr.borrower-table-title-row td {
        width: 25%;
    }

    .borrowers-recap.twoBorrowers tr.borrower-table-title-row td:not(:first-child) {
        text-align: right;
        color: black;
    }
    
    .finance-comment {
        white-space: normal;
    }

    ${recapStyleSheet}
`;

export default stylesheet;
