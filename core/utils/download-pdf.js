import fileSaver from 'file-saver';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

const decodeBase64 = string => atob(string);

const getLength = value => value.length;

const buildByteArray = (string, stringLength) => {
  const buffer = new ArrayBuffer(stringLength);
  const array = new Uint8Array(buffer);
  for (let i = 0; i < stringLength; i++) {
    array[i] = string.charCodeAt(i);
  }
  return array;
};

const createBlob = byteArray =>
  new Blob([byteArray], { type: 'application/pdf' });

const base64ToBlob = (base64String) => {
  const decodedString = decodeBase64(base64String);
  const decodedStringLength = getLength(decodedString);
  const byteArray = buildByteArray(decodedString, decodedStringLength);
  return byteArray ? createBlob(byteArray) : null;
};

const downloadPDF = (event, loanId, type) => {
  event.preventDefault();
  const { target } = event;
  const initialLabel = target.innerHTML;
  target.innerHTML = '<em>Downloading...</em>';
  target.classList.add('downloading');
  Meteor.call('downloadPDF', { loanId, type }, (error, response) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      const blob = base64ToBlob(response.base64);
      fileSaver.saveAs(blob, response.fileName);
      target.innerHTML = initialLabel;
      target.classList.remove('downloading');
    }
  });
};

export default downloadPDF;
