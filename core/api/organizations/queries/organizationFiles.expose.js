import { SecurityService } from '../..';
import query from './organizationFiles';

query.expose({
  firewall: () => SecurityService.checkCurrentUserIsAdmin(),
});
