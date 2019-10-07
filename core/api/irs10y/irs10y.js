import Irs10ySchema from './schemas/irs10ySchema';
import { IRS10Y_COLLECTION } from './irs10yConstants';
import { createCollection } from '../helpers/collectionHelpers';

const Irs10y = createCollection(IRS10Y_COLLECTION);

Irs10y.attachSchema(Irs10ySchema);
export default Irs10y;
