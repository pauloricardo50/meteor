import SecurityService from '../../security';
import { createMutator } from '../../mutations';
import PropertyService from '../PropertyService';
import * as defs from '../mutationDefinitions';

createMutator(defs.PROPERTY_INSERT, ({ object, userId }) => {
  SecurityService.properties.isAllowedToInsert();
  return PropertyService.insert({ object, userId });
});

createMutator(defs.PROPERTY_UPDATE, ({ propertyId, object }) => {
  SecurityService.properties.isAllowedToUpdate(propertyId);
  return PropertyService.update({ propertyId, object });
});

createMutator(defs.PROPERTY_DELETE, ({ propertyId }) => {
  SecurityService.properties.isAllowedToDelete(propertyId);
  return PropertyService.remove({ propertyId });
});
