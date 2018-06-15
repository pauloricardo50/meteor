import React from 'react';
import PropTypes from 'prop-types';

import TableFilter from './TableFilter';
import { flattenObjectTree } from '../../../utils/general';
import { filterArrayOfObjects } from '../../../utils/filteringFunctions';
import TableFiltersContainer from './TableFiltersContainer';

// class TableFilters extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       filters: this.props.filters,
//     };
//   }

// }

const TableFilters = ({
  data,
  filters,
  children,
  getFilterKeyFromPath,
  handleOnChange,
  createSelectOptionsForColumn,
  getSelectOptions,
}) => {
  const filteredData = filterArrayOfObjects(filters, data);

  return (
    <React.Fragment>
      <div className="table-filters">
        {flattenObjectTree(filters).map(({ path: filterPath, value }) => (
          <TableFilter
            key={getFilterKeyFromPath(filterPath)}
            filterKey={getFilterKeyFromPath(filterPath)}
            onChange={newSelectOptions =>
              handleOnChange(filterPath, newSelectOptions)
            }
            options={createSelectOptionsForColumn(filterPath, data)}
            value={getSelectOptions(value, filterPath)}
          />
        ))}
      </div>

      {children(filteredData)}
    </React.Fragment>
  );
};

TableFilters.propTypes = {
  data: PropTypes.array.isRequired,
  filters: PropTypes.object,
  children: PropTypes.func.isRequired,
  getFilterKeyFromPath: PropTypes.func.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  createSelectOptionsForColumn: PropTypes.func.isRequired,
  getSelectOptions: PropTypes.func.isRequired,
};

TableFilters.defaultProps = {
  filters: {},
};

export default TableFiltersContainer(TableFilters);
