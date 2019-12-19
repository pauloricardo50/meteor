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
        font-weight: normal;
    }

    .wanted-loan {
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: normal;
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
        width: 100%;
    }
`;
