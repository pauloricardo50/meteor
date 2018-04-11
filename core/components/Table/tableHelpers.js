export const ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

// "raw" and "label" keys have to be present in the object to display it
// this way
export const shouldDisplayLabelAndData = columnValue =>
  typeof columnValue === 'object' &&
  'raw' in columnValue &&
  'label' in columnValue;

const makeSortFunc = orderBy => (a, b) => {
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

  const sortedData = data.sort(makeSortFunc(newOrderBy));
  const sortedDataInCorrectOrder = isReversed
    ? sortedData.slice().reverse()
    : sortedData;

  return {
    data: sortedDataInCorrectOrder,
    order: isReversed ? ORDER.DESC : ORDER.ASC,
    orderBy: newOrderBy,
  };
};
