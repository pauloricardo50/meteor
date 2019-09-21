// Schema auto values tto convert first char of the value to upper case
export const autoValueToSentenceCase = () => {
  if (this.isSet) {
    const { value } = this;
    return value.charAt(0).toLocaleUpperCase() + value.substr(1);
  }
};
