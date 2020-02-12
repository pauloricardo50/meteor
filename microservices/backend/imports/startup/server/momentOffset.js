import moment from 'moment';

const localOffset = new Date().getTimezoneOffset();

moment.now = function() {
  return localOffset * 60 * 1000 + Date.now();
};
