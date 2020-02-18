import React from 'react';
import { ROW_TYPES } from './PdfTable';
import PdfTableRow from './PdfTableRow';

const PdfTableTooltips = ({ tooltips, startIndex }) =>
  tooltips.map(({ tooltip }, index) => (
    <PdfTableRow
      key={index}
      rowData={{
        label: (
          <small>
            <i>
              <sup>{tooltip.symbol}</sup> {tooltip.text}
            </i>
          </small>
        ),
        type: ROW_TYPES.TOOLTIP,
        colspan: 2,
      }}
      index={startIndex + index}
    />
  ));

export default PdfTableTooltips;
