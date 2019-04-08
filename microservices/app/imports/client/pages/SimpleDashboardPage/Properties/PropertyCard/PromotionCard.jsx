import promotionFiles from 'core/api/promotions/queries/promotionFiles';

import mergeFilesWithQuery from 'core/api/files/mergeFilesWithQuery';
import PropertyCard from '.';

export default mergeFilesWithQuery(
  promotionFiles,
  ({ document: { _id: promotionId } }) => ({ promotionId }),
  'document',
)(PropertyCard);
