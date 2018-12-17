import * as styles from '../../utils/styleHelpers';
import { BORDER_BLUE } from '../../cssConstants';

const stylesheet = `
    .cover-page {
        ${styles.flex(['FLEX_COLUMN'])}
        ${styles.flexGrow(1)}
        padding: 30px;
    }

    .cover-page .loan-info {
        ${styles.flex(['FLEX_COLUMN'])}
        ${styles.flexGrow(1)}
    } 

    .loan-info h1,h2,h3,h4,h5{
        color: ${BORDER_BLUE};
    }

    .loan-info .title {
        margin-top: 120px;
        margin-bottom: 0px;
    }

    .loan-info .loan-name {
        margin-top: 10px;
        margin-bottom: 80px;
        font-weight: normal;
    }

    .loan-info .loan-type {
        margin: 0px;
    }

    .loan-info .address {
        margin-top: 10px;
        font-weight: normal;
        margin-bottom: 160px;
        height: 40px;
    }

    .loan-info .borrowers {
        margin: 0px;
    }

    .cover-page .cover-footer {
        ${styles.flex([
    'FLEX_ROW',
    'ALIGN_ITEMS_FLEX_START',
    'JUSTIFY_CONTENT_SPACE_BETWEEN',
  ])}
        ${styles.ALIGN_SELF_FLEX_END}
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

    .cover-header img {
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
`;

export default stylesheet;
