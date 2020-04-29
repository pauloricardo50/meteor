import colors from '../../../../../../config/colors';
import {
  BOLD_WEIGHT,
  BORDER_BLUE,
  REGULAR_WEIGHT,
} from '../../../../pdfConstants';
import * as styles from '../../utils/styleHelpers';

const stylesheet = `
    .cover-page {
        ${styles.flex(['FLEX_COLUMN'])}
        ${styles.flexGrow(1)}
    }

    .cover-page .cover-content {
        ${styles.flex(['FLEX_COLUMN'])}
        ${styles.flexGrow(1)}
    } 

    .cover-content h1 {
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
        display: flex;
        justify-content: center;
    }

    .cover-content .loan-type {
        margin: 0;
        font-weight: ${REGULAR_WEIGHT};
        text-align: center;
        opacity: 0.6;
    }
    
    .cover-content .address {
        margin: 8px;
        margin-top: 8px;
        font-weight: ${REGULAR_WEIGHT};
        text-align: center;
        opacity: 0.6;
    }

    .cover-content .property-value {
        margin-top: 8px;
        font-weight: ${REGULAR_WEIGHT};
    }

    .cover-content .disbursement-date {
        margin: 0;
        margin-bottom: 20px;
        margin-top: 30px;
        font-weight: ${REGULAR_WEIGHT};
    }

    .cover-content .borrowers {
        margin: 0;
        margin-top: 8px;
        display: flex;
        justify-content: center;
    }

    .cover-content .loan-background-info {
        width: 100%;
        margin: 0;
        display: flex;
        flex-direction: column;
    }

    .cover-content .loan-background-info h5 {
        margin: 0;
        margin-bottom: 4px;
    }

    .cover-content .loan-background-info p {
        margin: 0;
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
        font-weight: ${REGULAR_WEIGHT};
    }

    .cover-footer .assigned-employee .name {
        font-weight: ${BOLD_WEIGHT};
    }

    .cover-header {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-between;
        padding-bottom: 16px;
        border-bottom: 1px solid ${BORDER_BLUE};
    }

    .cover-header >* {
        flex-basis: 33%;
        flex-grow: 1;
    }

    .cover-header h1 {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin: 0;
        color: ${BORDER_BLUE};
        font-weight: ${REGULAR_WEIGHT};
    }

    .cover-header h3 {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: flex-start;
        margin: 0;
        font-weight: ${REGULAR_WEIGHT};
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
        font-weight: ${REGULAR_WEIGHT};
        margin: 0;
    }

    .structure-recap-table {
        margin-bottom: 30px;
        width: 100%;
    }

    .structure-recap-table svg {
        width: 24px;
    }

    .cover-content hr {
        color: ${colors.borderGrey};
        background-color: ${colors.borderGrey};
        height: 1px;
        width: 40%;
        margin-top: 16px;
        margin-bottom: 16px;
        margin-left: auto;
        margin-right: auto;
        border: none;
    }
`;

export default stylesheet;
