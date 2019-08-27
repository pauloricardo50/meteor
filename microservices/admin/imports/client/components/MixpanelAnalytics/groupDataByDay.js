import moment from 'moment';
import groupBy from 'lodash/groupBy';

const groupDataByDay = events =>
  groupBy(events, event => moment.unix(event.properties.time).startOf('day'));

export default groupDataByDay;
