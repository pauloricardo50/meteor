import { createCollection } from '../helpers/collectionHelpers';
import { LOTS_COLLECTION } from './lotConstants';
import LotSchema from './schemas/LotSchema';

const Lots = createCollection(LOTS_COLLECTION, LotSchema);

export default Lots;
