import SecurityService from '../../security';
import query from './currentInterestRates';

query.expose({
  firewall(userId) {},
});
