import SecurityService from '../../security';
import query from './currentUser';

query.expose({
  firewall(userId) {},
});
