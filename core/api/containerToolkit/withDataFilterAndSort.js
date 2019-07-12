import sift from 'sift';
import { withProps } from 'recompose';

import sortArray from '../../utils/sortArrayOfObjects';

export const makeDataFilterAndSort = ({
  dataName = 'data',
  filterOptionsName = 'filterOptions',
  sortOptionName = 'sortOption',
}) =>
  withProps(({
    [filterOptionsName]: filterOptions = {},
    [sortOptionName]: sortOption = {},
    [dataName]: data = [],
  }) => {
    const filteredData = data.filter(sift(filterOptions));
    const sortedData = sortArray(
      filteredData,
      sortOption.field,
      sortOption.order,
    );

    return { [dataName]: sortedData };
  });

export default makeDataFilterAndSort({});
