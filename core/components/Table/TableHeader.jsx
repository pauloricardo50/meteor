import React from 'react';
import PropTypes from 'prop-types';

import {
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel
} from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import Tooltip from 'material-ui/Tooltip';

import { T } from 'core/components/Translation';

const styles = {
    cell: { textAlign: 'left' }
};

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
    noIntl
}) => (
    <TableHead>
        <TableRow>
            {selectAll && (
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={
                            numSelected > 0 && numSelected < rowCount
                        }
                        checked={numSelected === rowCount}
                        onChange={onSelectAll}
                    />
                </TableCell>
            )}
            {columnOptions.map(
                (
                    {
                        id,
                        style,
                        intlValues,
                        label,
                        numeric,
                        padding = 'dense'
                    },
                    index
                ) => (
                    <TableCell
                        key={id}
                        style={style || styles.cell}
                        numeric={numeric}
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
                                    {label ||
                                        (noIntl ? (
                                            id
                                        ) : (
                                            <T
                                                id={id}
                                                values={intlValues}
                                                list="table"
                                            />
                                        ))}
                                </TableSortLabel>
                            </Tooltip>
                        ) : (
                            label ||
                            (noIntl ? (
                                id
                            ) : (
                                <T id={id} values={intlValues} list="table" />
                            ))
                        )}
                    </TableCell>
                )
            )}
        </TableRow>
    </TableHead>
);

TableHeader.propTypes = {
    columnOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
    sortable: PropTypes.bool.isRequired,
    onSort: PropTypes.func,
    selectAll: PropTypes.bool.isRequired,
    onSelectAll: PropTypes.func,
    numSelected: PropTypes.number,
    rowCount: PropTypes.number.isRequired,
    order: PropTypes.string,
    orderBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    noIntl: PropTypes.bool
};

TableHeader.defaultProps = {
    onSort: undefined,
    onSelectAll: undefined,
    numSelected: 0,
    order: undefined,
    orderBy: undefined,
    noIntl: false
};

export default TableHeader;
