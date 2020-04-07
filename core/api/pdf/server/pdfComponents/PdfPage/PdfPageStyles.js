import { BORDER_BLUE, CONTENT_HEIGHT } from '../../../pdfConstants';

const PdfPageStyles = `
    .page {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 100%;
        box-sizing: border-box;
        align-items: stretch;
    }

    .full-height {
        height: ${CONTENT_HEIGHT}mm;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 120px;
        margin-top: 24px;
    }

    .header .address {
        display: flex;
        flex-direction: column;    
    }

    .header .address .company-name {
        font-weight: bold;
    }

    .pdf-page-title {
        margin-bottom: 16px;
    }

    .pdf-page-title h1 {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin: 0;
        color: ${BORDER_BLUE};
        font-weight: normal;
    }

    .pdf-page-title img {
        width: 30px;
        height: 30px;
        margin-right: 12px;
    }

    .pdf-page-footer {
        display: flex;
        justify-content: space-between;
        border-top: 1px solid ${BORDER_BLUE};
        width: 100%;
        height: 100%;
        padding-top: 16px;
        color: ${BORDER_BLUE};
        font-size: 10px;
    }

    .bold {
        font-weight: bold;
    }

    .secondary {
        opacity: 0.5;
    }
`;

export default PdfPageStyles;
