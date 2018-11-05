import SecurityService from '../../security';
import OrganizationService from '../OrganizationService';
import {
  organizationInsert,
  organizationUpdate,
  organizationRemove,
} from '../methodDefinitions';

organizationInsert.setHandler((context, { organization }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return OrganizationService.insert(organization);
});

organizationUpdate.setHandler((context, { organizationId, object }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return OrganizationService._update({ id: organizationId, object });
});

organizationRemove.setHandler((context, { organizationId }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return OrganizationService.remove(organizationId);
});
