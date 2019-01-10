import SecurityService from '../../security';
import {
  organisationInsert,
  organisationUpdate,
  organisationRemove,
  addContactToOrgnaisation,
} from '../methodDefinitions';
import OrganisationService from './OrganisationService';

organisationInsert.setHandler((context, { organisation }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return OrganisationService.insert(organisation);
});

organisationUpdate.setHandler((context, { organisationId, object }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return OrganisationService._update({ id: organisationId, object });
});

organisationRemove.setHandler((context, { organisationId }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return OrganisationService.remove(organisationId);
});

addContactToOrgnaisation.setHandler((context, { organisationId, contactId, metadata }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return OrganisationService.addLink({
    id: organisationId,
    linkName: 'contacts',
    linkId: contactId,
    metadata,
  });
});
