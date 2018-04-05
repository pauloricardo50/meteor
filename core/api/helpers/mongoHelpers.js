export const createRegexQuery = (fieldName, regex) => ({
  [fieldName]: { $regex: regex, $options: 'ix' },
});
