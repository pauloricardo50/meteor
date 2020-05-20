import { BORDER_BLUE, REGULAR_WEIGHT } from '../../../pdfConstants';

export default `
    .balance-sheet-table {
        width: 100%;
    }

    .balance-sheet-table td {
        width: 25%;
    }

    .balance-sheet-table .title-row td {
        text-align: left !important;
    }

    .balance-sheet-table tr.title-row td:nth-child(1),
    .balance-sheet-table tr td:nth-child(2) {
        padding-right: 8px;
    }

    .balance-sheet-table .title-row td:nth-child(2),
    .balance-sheet-table tr td:nth-child(3) {
        padding-left: 8px;
    }

    .balance-sheet-table .title-row td:nth-child(2) {
        padding-right: 0;
    }

    .balance-sheet-table tr td:nth-child(even) {
        text-align: right;
    }
    
    .balance-sheet-table tr td:nth-child(odd) {
        text-align: left;
    }

    .balance-sheet-table {
        margin-bottom: 40px;
    }

    .finma-ratio {
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: ${REGULAR_WEIGHT};
    }

    .wanted-loan {
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: ${REGULAR_WEIGHT};
    }

    .finma-ratio span {
        display: flex;
        align-items: center;
        font-size: 1.3em;
        margin-left: 8px;
    }

    .finma-ratio svg {
        width: 40px;
    }

    .remaining-own-funds-table {
        margin-top: 40px;
        width: 100%;
    }

    .pledge-table {
        width: 100%;
        margin-bottom: 40px;
    }

    .single-structure-recap-table {
        margin-top: 40px;
    }

    .own-funds-use-description {
        width: 100%;
        margin: 0;
        display: flex;
        flex-direction: column;
    }

    .own-funds-use-description .title {
        margin: 0;
        margin-bottom: 8px;
        color: ${BORDER_BLUE};
        font-weight: 800;
    }

    .own-funds-use-description p {
        margin: 0;
        border: 1px solid ${BORDER_BLUE};
        padding: 4px;
        white-space: pre-line;
    }

`;
