import { SecurityService } from '../..';
import { evaluateProperty } from '../methodDefinitions';
import WuestService from './WuestService';

evaluateProperty.setHandler((context, { propertyId }) => {
  SecurityService.properties.isAllowedToUpdate(propertyId);
  return WuestService.evaluateById(propertyId).then(({ min, max }) => ({
    min,
    max,
  }));
});
