export const generateMatchAllWordsRegexp = words =>
  `${words.map(word => `(?=.*${word})`).join('')}.+`;

export const generateMatchAnyWordRegexp = string =>
  string.trim().replace(/\s+/g, '|');

export const splitStringIntoWords = string => string.trim().split(/\s+/);

export const createRegexQuery = (fieldName, searchQuery) => {
  const searchQueryWords = splitStringIntoWords(searchQuery);
  const containsMultipleWords = searchQueryWords.length > 1;

  if (containsMultipleWords) {
    return {
      [fieldName]: {
        $regex: generateMatchAllWordsRegexp(searchQueryWords),
        $options: 'gi',
      },
    };
  }

  return { [fieldName]: { $regex: searchQuery.trim(), $options: 'ix' } };
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

export const createdAt = {
  type: Date,
  autoValue() {
    if (this.isInsert) {
      return new Date();
    }
    if (this.isUpsert) {
      return { $setOnInsert: new Date() };
    }
    this.unset();
  },
};

export const updatedAt = {
  type: Date,
  autoValue() {
    if (this.isUpdate) {
      return new Date();
    }
  },
  denyInsert: true,
  optional: true,
};
