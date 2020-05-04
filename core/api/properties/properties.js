import { createCollection } from '../helpers/collectionHelpers';
import * as propertyConstants from './propertyConstants';
import PropertySchema from './schemas/PropertySchema';

const Properties = createCollection(propertyConstants.PROPERTIES_COLLECTION);

// Attach schema
Properties.attachSchema(PropertySchema);
export default Properties;
