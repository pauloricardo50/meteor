import moment from 'moment';
import _ from 'lodash';

const groupDataByDay = events =>
    _.groupBy(events, event =>
        moment.unix(event.properties.time).startOf('day')
    );

export default groupDataByDay;
