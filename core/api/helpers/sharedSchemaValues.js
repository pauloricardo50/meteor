import { stringToSentenceCase } from '../../utils/stringUtils';
// Convert first char of the string to upper case
export const autoValueSentenceCase = function() {
  if (this.isSet) {
    const { value } = this;
    return stringToSentenceCase(value);
  }
};
