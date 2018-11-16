import * as styles from '../../../utils/styleHelpers';

const stylesheet = `
    .project-table {
        ${styles.flex(['FLEX_ROW'])}
    }

    .project-table .structure-table,
    .project-table .property-table {
        ${styles.flex(['FLEX_COLUMN'])}
        width: 50%;
        box-sizing: border-box;
        padding: 0 16px;
    }
`;

export default stylesheet;
