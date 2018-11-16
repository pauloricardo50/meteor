import { BORDER_BLUE, BORDER_GREY } from '../cssConstants';

export default `
    .pdf-table {
        border-collapse: collapse; 
    }

    .pdf-table tr {
        width: 100%;
    }

    .pdf-table tr td:last-of-type {
        text-align: right;
    }
    
    .pdf-table tr.regular-row {
        border-bottom: 1px solid ${BORDER_GREY};
    }

    .pdf-table tr.regular-row td {
        font-weight: 400;
    }

    .pdf-table tr.title-row {
        border-bottom: 1px solid ${BORDER_BLUE};
    }

    .pdf-table tr.title-row td {
        color: ${BORDER_BLUE};
        margin: 0;
        padding: 8px 0;
        text-align: left;
        font-weight: 600;
        width: 100%;
    }

    .pdf-table tr.title-row:not(:first-child) td {
        padding-top: 32px;
    }

    .pdf-table tr.empty-row {
    }

    .pdf-table tr.sum-row {
        border-top: 1px solid ${BORDER_BLUE};
        border-bottom: 1px solid ${BORDER_BLUE};
    }

    .pdf-table tr.sum-row td {
        font-weight: 500;
    }

    .pdf-table td {
        width: 50%;
        padding: 8px 0px;
    }

    .pdf-table tr td:first-of-type {
        opacity: 0.8;
    }
`;
