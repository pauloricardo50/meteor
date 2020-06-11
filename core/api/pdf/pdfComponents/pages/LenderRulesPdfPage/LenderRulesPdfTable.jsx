import React from 'react';

import { ROW_TYPES, classes } from '../../PdfTable/PdfTable';

const LenderRulesPdfTable = ({ rows }) => (
  <table className="pdf-table lender-rules-table">
    <tr className={classes[ROW_TYPES.TITLE]}>
      <td>Type</td>
      <td>Prise en compte</td>
      <td>Détails</td>
    </tr>
    {rows}
  </table>
);

export default LenderRulesPdfTable;
