import React from 'react';
import cx from 'classnames';

import { ROW_TYPES, classes } from './PdfTable';

const multiColumn = (data, style, columnOptions = []) =>
  data.map((x, index) => {
    const { className = '', style: columnStyle = {} } =
      columnOptions[index] || {};
    return (
      <td
        className={className}
        style={{ ...columnStyle, ...style }}
        key={index}
      >
        {x}
      </td>
    );
  });

const singleColumn = (
  data,
  style,
  { className = '', style: columnStyle = {} } = {},
) => (
  <td style={{ ...columnStyle, ...style }} className={className}>
    {data}
  </td>
);

const PdfTableRow = ({
  rowData: {
    label,
    labelStyle = {},
    tooltip,
    data,
    style,
    colspan = 1,
    type = ROW_TYPES.REGULAR,
    className,
  },
  index,
  columnOptions = [],
}) => {
  if (colspan > 1) {
    const { className: columnClassName = '', style: columnStyle = {} } =
      columnOptions[0] || {};
    return (
      <tr key={index} className={cx(classes[type], className)}>
        {label && (
          <td
            className={columnClassName}
            colSpan={colspan}
            style={{ ...columnStyle, ...labelStyle }}
          >
            {label}
          </td>
        )}
      </tr>
    );
  }

  const { className: columnClassName = '', style: columnStyle = {} } =
    columnOptions[0] || {};

  return (
    <tr key={index} className={cx(classes[type], className)}>
      {label && (
        <td style={columnStyle} className={columnClassName}>
          {label}
          {tooltip && <sup> {tooltip.symbol}</sup>}
        </td>
      )}
      {Array.isArray(data)
        ? multiColumn(data, style, columnOptions.slice(1))
        : singleColumn(data, style, columnOptions[1])}
    </tr>
  );
};

export default PdfTableRow;
