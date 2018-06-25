import sift from 'sift';
import { withProps } from 'recompose';
import sortArray from '../../utils/sortArray';

export default (config = {}) =>
  withProps((props) => {
    const {
      dataName = 'data',
      filterOptionsName = 'filterOptions',
      sortOptionsName = 'sortOptions',
    } = config;

    const filterOptions = props[filterOptionsName] || {};
    const sortOptions = props[sortOptionsName] || {};
    const data = props[dataName] || [];

    const filteredData = sift(filterOptions, data);
    const sortedData = sortArray(
      filteredData,
      sortOptions.field,
      sortOptions.order,
    );

    return {
      [dataName]: sortedData,
    };
  });
