import { Method } from '../methods/methods';

export const evaluateProperty = new Method({
  name: 'evaluateProperty',
  params: {
    propertyId: String,
  },
});
