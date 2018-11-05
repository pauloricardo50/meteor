import SecurityService from '../../security';
import OrganizationService from '../OrganizationService';
import {
  organizationInsert,
  organizationUpdate,
  organizationRemove,
} from '../methodDefinitions';

organizationInsert.setHandler((context, { organization }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return OrganizationService.insert({ object: organization });
});

organizationUpdate.setHandler((context, { organizationId, object }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return OrganizationService.update({ id: organizationId, object });
});

organizationRemove.setHandler((context, { organizationId }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return OrganizationService.remove(organizationId);
});
