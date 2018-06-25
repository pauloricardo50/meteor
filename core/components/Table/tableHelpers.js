import { ORDER } from '../../utils/sortArray';

export { ORDER } from '../../utils/sortArray';

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

const determineOrder = ({
  oldOrderBy,
  newOrderBy,
  order,
  changeOrder = true,
}) => {
  let isReversed;
  let finalOrder;

  if (oldOrderBy !== newOrderBy) {
    // First click, Initial ascending order
    isReversed = false;
    finalOrder = ORDER.ASC;
  } else if (changeOrder) {
    // Clicked a second time, reverse order
    isReversed = order === ORDER.ASC;
    finalOrder = isReversed ? ORDER.DESC : ORDER.ASC;
  } else {
    // If data is just being sorted again without user changing the order,
    // don't change the order and keep it as is.
    // This can happen if new data is added to the table, or some data changed
    isReversed = order !== ORDER.ASC;
    finalOrder = order;
  }

  return { isReversed, finalOrder };
};

export const sortData = ({
  data,
  newOrderBy,
  orderBy: oldOrderBy,
  order,
  changeOrder,
}) => {
  const { isReversed, finalOrder } = determineOrder({
    oldOrderBy,
    newOrderBy,
    order,
    changeOrder,
  });

  const sortedData = data.sort(makeSortFunc(newOrderBy));
  const sortedDataInCorrectOrder = isReversed
    ? sortedData.slice().reverse()
    : sortedData;

  return {
    data: sortedDataInCorrectOrder,
    order: finalOrder,
    orderBy: newOrderBy,
  };
};
