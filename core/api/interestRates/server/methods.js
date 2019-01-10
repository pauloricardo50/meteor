import SecurityService from '../../security';
import InterestRatesService from './InterestRatesService';
import {
  interestRatesInsert,
  interestRatesRemove,
  interestRatesUpdate,
} from '../methodDefinitions';

interestRatesInsert.setHandler((context, { interestRates }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return InterestRatesService.insert(interestRates);
});

interestRatesRemove.setHandler((context, { interestRatesId }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return InterestRatesService.remove(interestRatesId);
});

interestRatesUpdate.setHandler((context, { interestRatesId, object }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return InterestRatesService._update({ id: interestRatesId, object });
});
