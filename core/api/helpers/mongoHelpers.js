const containsMultipleWords = string => string.indexOf(' ') > -1;

const generateRegexToSearchAllWordsInString = searchQueryWords =>
  `${searchQueryWords.map(word => `(?=.*${word})`).join('')}.+`;

export const createRegexQuery = (fieldName, searchQuery) => {
  if (containsMultipleWords(searchQuery)) {
    const searchQueryWords = searchQuery.trim().split(' ');

    return {
      [fieldName]: {
        $regex: generateRegexToSearchAllWordsInString(searchQueryWords),
        $options: 'gi',
      },
    };
  }

  return { [fieldName]: { $regex: searchQuery, $options: 'ix' } };
};

export const createSearchFilters = (searchFieldsArray, searchQuery) => {
  if (searchFieldsArray.length > 1) {
    // multiple fields to match
    return {
      $or: searchFieldsArray.map(searchField =>
        createRegexQuery(searchField, searchQuery)),
    };
  }
  // single field to match
  const fieldName = searchFieldsArray[0];
  return createRegexQuery(fieldName, searchQuery);
};
