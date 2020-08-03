import SecurityService from '../../security';
import {
  interestRatesInsert,
  interestRatesRemove,
  interestRatesUpdate,
} from '../methodDefinitions';
import InterestRatesService from './InterestRatesService';

interestRatesInsert.setHandler((context, { interestRates }) => {
  SecurityService.checkUserIsAdmin(context.userId);
  return InterestRatesService.insert(interestRates);
});

interestRatesRemove.setHandler((context, { interestRatesId }) => {
  SecurityService.checkUserIsAdmin(context.userId);
  return InterestRatesService.remove(interestRatesId);
});

interestRatesUpdate.setHandler((context, { interestRatesId, object }) => {
  SecurityService.checkUserIsAdmin(context.userId);
  return InterestRatesService._update({ id: interestRatesId, object });
});
