import groupBy from 'lodash/groupBy';
import moment from 'moment';

const groupDataByDay = events =>
  groupBy(events, event => moment.unix(event.properties.time).startOf('day'));

export default groupDataByDay;
