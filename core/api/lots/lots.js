import LotSchema from './schemas/LotSchema';
import { LOTS_COLLECTION } from './lotConstants';
import { createCollection } from '../helpers/collectionHelpers';

const Lots = createCollection(LOTS_COLLECTION);

Lots.attachSchema(LotSchema);
export default Lots;
