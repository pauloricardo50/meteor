import SecurityService from '../../security';
import OrganisationService from '../OrganisationService';
import {
  organisationInsert,
  organisationUpdate,
  organisationRemove,
  addContactToOrgnaisation,
} from '../methodDefinitions';

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
    multi: false,
    hasMeta: true,
    metadata,
  });
});
