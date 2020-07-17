import React from 'react';

import T from '../../../../../components/Translation';
import { ROW_TYPES, classes } from '../../PdfTable/PdfTable';

const LenderRulesPdfTable = ({ rows }) => (
  <table className="pdf-table lender-rules-table">
    <tr className={classes[ROW_TYPES.TITLE]}>
      <td>
        <T id="PDF.lenderRules.type" />
      </td>
      <td>
        <T id="PDF.lenderRules.value" />
      </td>
      <td>
        <T id="PDF.lenderRules.details" />
      </td>
    </tr>
    {rows}
  </table>
);

export default LenderRulesPdfTable;
