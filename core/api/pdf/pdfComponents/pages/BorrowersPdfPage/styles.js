import recapStyleSheet from './recapStyleSheet';
import { BORDER_BLUE } from '../../../pdfConstants';

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

${recapStyleSheet}
`;

export default stylesheet;
