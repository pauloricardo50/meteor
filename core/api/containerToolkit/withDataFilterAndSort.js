import sift from 'sift';
import { withProps } from 'recompose';
import sortArray from '../../utils/sortArrayOfObjects';

export const makeDataFilterAndSort = ({
  dataName = 'data',
  filterOptionsName = 'filterOptions',
  sortOptionName = 'sortOption',
}) =>
  withProps((props) => {
    const filterOptions = props[filterOptionsName] || {};
    const sortOption = props[sortOptionName] || {};
    const data = props[dataName] || [];

    const filteredData = sift(filterOptions, data);
    const sortedData = sortArray(
      filteredData,
      sortOption.field,
      sortOption.order,
    );

    return {
      [dataName]: sortedData,
    };
  });

export default makeDataFilterAndSort({});
