import SecurityService from '../../security';
import {
  addContactToOrgnaisation,
  addUserToOrganisation,
  organisationInsert,
  organisationRemove,
  organisationUpdate,
  removeUserFromOrganisation,
  setCommissionRates,
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
  SecurityService.checkCurrentUserIsDev();
  return OrganisationService.remove(organisationId);
});

addContactToOrgnaisation.setHandler(
  (context, { organisationId, contactId, metadata }) => {
    SecurityService.checkCurrentUserIsAdmin();
    return OrganisationService.addLink({
      id: organisationId,
      linkName: 'contacts',
      linkId: contactId,
      metadata,
    });
  },
);

addUserToOrganisation.setHandler(
  (context, { organisationId, userId, metadata }) => {
    SecurityService.checkCurrentUserIsAdmin();
    return OrganisationService.addLink({
      id: organisationId,
      linkName: 'users',
      linkId: userId,
      metadata,
    });
  },
);

removeUserFromOrganisation.setHandler((context, { organisationId, userId }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return OrganisationService.removeLink({
    id: organisationId,
    linkName: 'users',
    linkId: userId,
  });
});

setCommissionRates.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return OrganisationService.setCommissionRates(params);
});
