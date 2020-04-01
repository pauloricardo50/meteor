import moment from 'moment';

import Insurances from '.';
import proNotesReducer from '../reducers/proNotesReducer';
import { INSURANCE_PREMIUM_FREQUENCY } from './insuranceConstants';

Insurances.addReducers({
  proNotes: proNotesReducer,
  duration: {
    body: { startDate: 1, endDate: 1, premiumFrequency: 1 },
    reduce: ({ startDate, endDate, premiumFrequency }) => {
      const rawDuration = moment.duration(
        moment(endDate).diff(moment(startDate)),
      );

      switch (premiumFrequency) {
        case INSURANCE_PREMIUM_FREQUENCY.SINGLE:
          return 1;
        case INSURANCE_PREMIUM_FREQUENCY.MONTHLY:
          return Math.round(rawDuration.asMonths());
        case INSURANCE_PREMIUM_FREQUENCY.QUARTERLY:
          return Math.round(rawDuration.asMonths() / 3);
        case INSURANCE_PREMIUM_FREQUENCY.BIANNUAL:
          return Math.round(rawDuration.asYears() * 2);
        case INSURANCE_PREMIUM_FREQUENCY.YEARLY:
          return Math.round(rawDuration.asYears());
        default:
          return 0;
      }
    },
  },
});
