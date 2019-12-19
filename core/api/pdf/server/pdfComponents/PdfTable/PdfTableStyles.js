import { BORDER_BLUE, BORDER_GREY } from '../../../pdfConstants';

export default `
    .pdf-table {
        border-collapse: collapse;
        table-layout: fixed;
    }

    .pdf-table tr {
        // width: 100%;
    }

    .pdf-table td {
        // width: 50%;
        padding: 4px 0px;
        vertical-align: middle;
    }

    .pdf-table tr td:not(:first-of-type) {
        // text-align: right;
    }

    .pdf-table tr:first-child {
        border-top: none !important;
    }
    
    .pdf-table tr.regular-row {
        border-top: 1px solid ${BORDER_GREY};
    }

    .pdf-table tr.regular-row td {
        font-weight: normal;
    }

    .pdf-table tr.subsection-row {
        border-top: none !important;
    }

    .pdf-table tr.subsection-row td {
        font-weight: bold;
    }

    .pdf-table tr.title-row {
        border-bottom: 1px solid ${BORDER_BLUE};
    }

    .pdf-table tr.title-row td {
        color: ${BORDER_BLUE};
        margin: 0;
        padding: 8px 0;
        text-align: left;
        font-weight: bold;
        // width: 100%;
    }

    .pdf-table tr.tooltip {
        border-top: none;
    }

    .pdf-table tr.tooltip td {
        font-weight: 200;
        padding-top: 20px;
    }

    .pdf-table tr.tooltip ~ tr.tooltip td{
        padding-top: 4px;
    }


    .pdf-table tr.title-row:not(:first-child) td {
        padding-top: 24px;
    }

    .pdf-table tr.title-row.no-padding td {
        padding: 8px 0;
    }

    .pdf-table tr.empty-row {
        border-color: white;
    }

    .pdf-table tr.sum-row {
        border-top: 1px solid ${BORDER_BLUE};
        border-bottom: 1px solid ${BORDER_BLUE};
    }

    .pdf-table tr.sum-row td {
        font-weight: bold;
    }
`;
