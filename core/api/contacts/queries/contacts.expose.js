import SecurityService from '../../security';
import query from './contacts';

query.expose({
  firewall(userId) {},
});
