import * as propertyConstants from './propertyConstants';
import PropertySchema from './schemas/PropertySchema';
import { createCollection } from '../helpers/collectionHelpers';

const Properties = createCollection(propertyConstants.PROPERTIES_COLLECTION);

// Attach schema
Properties.attachSchema(PropertySchema);
export default Properties;
