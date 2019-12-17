import * as styles from '../../utils/styleHelpers';
import { BORDER_BLUE } from '../../../../pdfConstants';

const stylesheet = `
    .cover-page {
        ${styles.flex(['FLEX_COLUMN'])}
        ${styles.flexGrow(1)}
    }

    .cover-page .cover-content {
        ${styles.flex(['FLEX_COLUMN'])}
        ${styles.flexGrow(1)}
    } 

    .cover-content h1,h2,h3,h4,h5 {
        color: ${BORDER_BLUE};
    }

    .cover-content .organisation-logo {
        display: block;
        width: auto;
        height: auto;
        max-height: 80px;
        max-width: 200px;
        align-self: center;
        margin-top: 40px;
        margin-bottom: -80px;
    }

    .cover-content .title {
        margin-top: 120px;
        margin-bottom: 0;
    }

    .cover-content .loan-type {
        margin: 0;
    }
    
    .cover-content .address {
        margin: 0;
        margin-top: 8px;
        font-weight: normal;
    }

    .cover-content .property-value {
        margin-top: 8px;
        font-weight: normal;
    }

    .cover-content .property-type {
        margin-top: 8px;
        margin-bottom: 8px;
    }

    .cover-content .disbursement-date {
        margin: 0;
        margin-bottom: 30px;
    }

    .cover-content .borrowers {
        margin: 0;
        margin-top: 8px;
        margin-bottom: 32px;
    }

    .cover-content .loan-background-info {
        width: 100%;
        margin: 0;
        display: flex;
        flex-direction: column;
    }

    .cover-content .loan-background-info h4 {
        margin: 0;
        margin-bottom: 8px;
    }

    .cover-content .loan-background-info p {
        border: 1px solid ${BORDER_BLUE};
        padding: 4px;
        white-space: pre-line;
        font-size: 10px;
    }

    .cover-page .cover-footer {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        align-self: flex-end;
        width: 100%;
        border-top: 1px solid ${BORDER_BLUE};
        padding-top: 16px;
        color: ${BORDER_BLUE};
    }

    .cover-footer .assigned-employee {
        ${styles.flex(['FLEX_COLUMN'])}
    }

    .cover-footer .assigned-employee >* {
        margin: 0px;
        font-weight: normal;
    }

    .cover-footer .assigned-employee .name {
        font-weight: bold;
    }

    .cover-header {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-between;
        padding-bottom: 16px;
        border-bottom: 1px solid ${BORDER_BLUE};
    }

    .cover-header h1 {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin: 0;
        color: ${BORDER_BLUE};
        font-weight: normal;
    }

    .cover-header h3 {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: flex-start;
        margin: 0;
        font-weight: normal;
    }

    .cover-header .epotek-logo {
        width: 30px;
        height: 30px;
        margin-right: 12px;
    }

    .cover-header .e-potek-address {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: flex-end;
    }

    .e-potek-address h6 {
        color: ${BORDER_BLUE};
        font-weight: normal;
        margin: 0;
    }

    .structure-recap-table {
        margin-bottom: 30px;
        width: 100%;
    }

    .structure-recap-table svg {
        width: 24px;
    }
`;

export default stylesheet;
