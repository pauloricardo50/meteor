import { Meteor } from 'meteor/meteor';

// Generates permutations of all case variations of a given string.
const generateCasePermutationsForString = string => {
  let permutations = [''];
  for (let i = 0; i < string.length; i++) {
    const ch = string.charAt(i);
    permutations = [].concat(
      ...permutations.map(prefix => {
        const lowerCaseChar = ch.toLowerCase();
        const upperCaseChar = ch.toUpperCase();
        // Don't add unneccesary permutations when ch is not a letter
        if (lowerCaseChar === upperCaseChar) {
          return [prefix + ch];
        }
        return [prefix + lowerCaseChar, prefix + upperCaseChar];
      }),
    );
  }
  return permutations;
};

// Generates a MongoDB selector that can be used to perform a fast case
// insensitive lookup for the given fieldName and string. Since MongoDB does
// not support case insensitive indexes, and case insensitive regex queries
// are slow, we construct a set of prefix selectors for all permutations of
// the first 4 characters ourselves. We first attempt to matching against
// these, and because 'prefix expression' regex queries do use indexes (see
// http://docs.mongodb.org/v2.6/reference/operator/query/regex/#index-use),
// this has been found to greatly improve performance (from 1200ms to 5ms in a
// test with 1.000.000 users).
export const selectorForFastCaseInsensitiveLookup = (fieldName, string) => {
  // Performance seems to improve up to 4 prefix characters
  const prefix = string.substring(0, Math.min(string.length, 4));
  const orClause = generateCasePermutationsForString(prefix).map(
    prefixPermutation => {
      const selector = {};
      selector[fieldName] = new RegExp(
        `^${Meteor._escapeRegExp(prefixPermutation)}`,
      );
      return selector;
    },
  );
  const caseInsensitiveClause = {};
  caseInsensitiveClause[fieldName] = new RegExp(
    `^${Meteor._escapeRegExp(string)}$`,
    'i',
  );
  return { $and: [{ $or: orClause }, caseInsensitiveClause] };
};
