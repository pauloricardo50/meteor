import * as styles from '../../utils/styleHelpers';
import { BORDER_BLUE } from '../../../pdfConstants';

const stylesheet = `
    .cover-page {
        ${styles.flex(['FLEX_COLUMN'])}
        ${styles.flexGrow(1)}
        // padding: 30px; pourquoi yavait ce padding?
    }

    .cover-page .cover-content {
        ${styles.flex(['FLEX_COLUMN'])}
        ${styles.flexGrow(1)}
    } 

    .cover-content h1,h2,h3,h4,h5 {
        color: ${BORDER_BLUE};
    }

    .cover-content .organisation-logo {
        max-height: 80px;
        max-width: 200px;
        width: 100%;
        align-self: center;
        margin-top: 40px;
        margin-bottom: -80px;
    }

    .cover-content .title {
        margin-top: 120px;
        margin-bottom: 0;
    }

    .cover-content .loan-name {
        margin-top: 8px;
        margin-bottom: 80px;
        font-weight: normal;
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
        margin-bottom: 120px;
    }

    .cover-content .borrowers {
        margin: 0;
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
        margin-top: 100px;
    }

    .structure-recap-table tr td {
        width: 25% !important;
        display: inline-flex;
        align-items: center;
    }

    .structure-recap-table td:not(:first-child) {
        justify-content: flex-end;
    }

    .structure-recap-table svg {
        width: 24px;
    }
`;

export default stylesheet;
