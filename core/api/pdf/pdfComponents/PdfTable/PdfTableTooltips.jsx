// @flow
import React from 'react';
import { ROW_TYPES } from './PdfTable';

type PdfTableTooltipsProps = {
  tooltips: Array<Object>,
  rowRenderFunc: Function,
  startIndex: Number,
};

const PdfTableTooltips = ({
  tooltips,
  rowRenderFunc: row,
  startIndex,
}: PdfTableTooltipsProps) =>
  tooltips.map(({ tooltip }, index) =>
    row(
      {
        label: (
          <small>
            <i>
              <sup>{tooltip.symbol}</sup> {tooltip.text}
            </i>
          </small>
        ),
        type: ROW_TYPES.TOOLTIP,
        colspan: 2,
      },
      startIndex + index,
    ));

export default PdfTableTooltips;
