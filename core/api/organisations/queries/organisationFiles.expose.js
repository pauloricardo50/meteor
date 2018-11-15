import { SecurityService } from '../..';
import query from './organisationFiles';

query.expose({
  firewall: () => SecurityService.checkCurrentUserIsAdmin(),
});
