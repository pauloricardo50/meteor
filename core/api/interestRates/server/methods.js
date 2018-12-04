import SecurityService from '../../security';
import InterestRatesService from '../InterestRatesService';
import {
  interestRatesInsert,
  interestRatesRemove,
  interestRatesUpdate,
} from '../methodDefinitions';

interestRatesInsert.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return InterestRatesService.insert(params);
});

interestRatesRemove.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return InterestRatesService.remove(params);
});

interestRatesUpdate.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return InterestRatesService._update(params);
});
