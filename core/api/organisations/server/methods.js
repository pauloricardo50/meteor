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
  SecurityService.checkUserIsAdmin(context.userId);
  return OrganisationService.insert(organisation);
});

organisationUpdate.setHandler((context, { organisationId, object }) => {
  SecurityService.checkUserIsAdmin(context.userId);
  return OrganisationService._update({ id: organisationId, object });
});

organisationRemove.setHandler((context, { organisationId }) => {
  SecurityService.checkUserIsDev(context.userId);
  return OrganisationService.remove(organisationId);
});

addContactToOrgnaisation.setHandler(
  (context, { organisationId, contactId, metadata }) => {
    SecurityService.checkUserIsAdmin(context.userId);
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
    SecurityService.checkUserIsAdmin(context.userId);
    return OrganisationService.addLink({
      id: organisationId,
      linkName: 'users',
      linkId: userId,
      metadata,
    });
  },
);

removeUserFromOrganisation.setHandler((context, { organisationId, userId }) => {
  SecurityService.checkUserIsAdmin(context.userId);
  return OrganisationService.removeLink({
    id: organisationId,
    linkName: 'users',
    linkId: userId,
  });
});

setCommissionRates.setHandler((context, params) => {
  SecurityService.checkUserIsAdmin(context.userId);
  return OrganisationService.setCommissionRates(params);
});
