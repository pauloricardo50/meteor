import { createCollection } from '../helpers/collectionHelpers';
import { PROPERTIES_COLLECTION } from './propertyConstants';
import PropertySchema from './schemas/PropertySchema';

const Properties = createCollection(PROPERTIES_COLLECTION, PropertySchema);

export default Properties;
