import React from 'react';
import PropTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';

import T from 'core/components/Translation';


const TableHeader = ({
  columnOptions,
  sortable,
  onSort,
  selectAll,
  onSelectAll,
  numSelected,
  rowCount,
  order,
  orderBy,
  noIntl,
}) => (
  <TableHead className="table-header">
    <TableRow>
      {selectAll && (
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAll}
          />
        </TableCell>
      )}
      {columnOptions.map(({ id, style, intlValues, label, align, padding }, index) => (
        <TableCell
          key={id}
          style={style}
          align={align}
          padding={padding}
        >
          {sortable ? (
            <Tooltip
              title={<T id="Table.sort" />}
              placement="bottom-start"
              enterDelay={300}
            >
              <TableSortLabel
                active={orderBy === index}
                direction={order}
                onClick={() => onSort(index)}
              >
                {label
                    || (noIntl ? (
                      id
                    ) : (
                      <T id={id} values={intlValues} list="table" />
                    ))}
              </TableSortLabel>
            </Tooltip>
          ) : (
            label
              || (noIntl ? id : <T id={id} values={intlValues} list="table" />)
          )}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

TableHeader.propTypes = {
  columnOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  noIntl: PropTypes.bool,
  numSelected: PropTypes.number,
  onSelectAll: PropTypes.func,
  onSort: PropTypes.func,
  order: PropTypes.string,
  orderBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rowCount: PropTypes.number.isRequired,
  selectAll: PropTypes.bool.isRequired,
  sortable: PropTypes.bool.isRequired,
};

TableHeader.defaultProps = {
  onSort: undefined,
  onSelectAll: undefined,
  numSelected: 0,
  order: undefined,
  orderBy: undefined,
  noIntl: false,
};

export default TableHeader;
