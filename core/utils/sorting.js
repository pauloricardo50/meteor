// @flow
// Sorting basics:
// If the return value is positive, sort a higher up than b
import moment from 'moment';

const isDate = date => date instanceof Date;

const sortFunc = (a, b) => {
  if (!a) {
    return -1;
  }
  if (!b) {
    return 1;
  }

  if (typeof a === 'string') {
    if (typeof b === 'string') {
      // a and b are strings

      return a.localeCompare(b);
    }
    // a string and b number
    return 1; // a > b
  }
  if (typeof b === 'string') {
    // a number and b string
    return -1; // a < b
  }

  // a and b are Date
  if (isDate(a) && isDate(b)) {
    return moment(b).isBefore(a) ? 1 : -1;
  }

  // a and b are numbers
  return Number.parseFloat(a) - Number.parseFloat(b);
};

const makeSort = (isAscending = true) => {
  if (isAscending) {
    return sortFunc;
  }

  return (...args) => -1 * sortFunc(...args);
};

export default makeSort;

export const sortByStatus = (statuses, key = 'status') => (
  { [key]: statusA },
  { [key]: statusB },
) => statuses.indexOf(statusA) - statuses.indexOf(statusB);
