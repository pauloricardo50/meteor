import * as styles from '../../utils/styleHelpers';

const stylesheet = `
    .project-table {
        ${styles.flex(['FLEX_ROW'])}
        justify-content: space-between;
    }

    .project-table .structure-table,
    .project-table .property-table {
        ${styles.flex(['FLEX_COLUMN'])}
        width: 48%;
        box-sizing: border-box;
    }
`;

export default stylesheet;
