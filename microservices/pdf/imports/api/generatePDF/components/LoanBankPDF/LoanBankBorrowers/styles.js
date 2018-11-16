import recapStyleSheet from './recapStyleSheet';

const stylesheet = `

.borrowers-recap {
    width: 100%;
}

.borrowers-recap {
    width: 50%;
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

${recapStyleSheet}
`;

export default stylesheet;
