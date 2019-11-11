// Convert first char of the string to upper case
export const stringToSentenceCase = string =>
  string && string.charAt(0).toLocaleUpperCase() + string.substr(1);
