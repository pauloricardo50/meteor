export const ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const shouldDisplayLabelAndData = columnValue =>
  typeof columnValue === 'object' &&
  columnValue.raw !== undefined &&
  columnValue.label !== undefined;

const makeComparator = orderBy => (a, b) => {
  let valueA = a.columns[orderBy];
  let valueB = b.columns[orderBy];

  // Add support for columns that have a label and raw data
  if (shouldDisplayLabelAndData(valueA)) {
    valueA = valueA.raw;
    valueB = valueB.raw;
  }

  if (typeof valueA === 'string') {
    if (typeof valueB === 'string') {
      // a and b are strings
      return valueA.localeCompare(valueB);
    }
    // a string and b number
    return 1; // a > b
  }
  if (typeof valueB === 'string') {
    // a number and b string
    return -1; // a < b
  }
  // a and b are numbers
  return Number.parseFloat(valueA) - Number.parseFloat(valueB);
};

export const sortData = ({ data, newOrderBy, orderBy, order }) => {
  let isReversed;

  if (orderBy === newOrderBy) {
    // Clicked a second time, reverse order
    isReversed = order === ORDER.ASC;
  } else {
    // Initial order
    isReversed = false;
  }

  const sortedData = data.sort(makeComparator(newOrderBy));
  const sortedDataInCorrectOrder = isReversed
    ? sortedData.slice().reverse()
    : sortedData;

  return {
    data: sortedDataInCorrectOrder,
    order: isReversed ? ORDER.DESC : ORDER.ASC,
    orderBy: newOrderBy,
  };
};
